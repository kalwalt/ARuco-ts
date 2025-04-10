import {SVD} from './svd';
import {Point, Vec3, Mat3} from './math-types';

export class Posit {
    public model: Vec3[];
    public focalLength: number;
    public modelVectors: Mat3;
    public modelNormal: Vec3;
    public modelPseudoInverse: Mat3;

    constructor(modelSize: number, focalLength: number) {
        this.model = this.buildModel(modelSize);
        this.focalLength = focalLength;

        this.init();
    };

    buildModel(modelSize: number): Vec3[] {
        const half = modelSize / 2.0;

        return [
            new Vec3(-half, half, 0.0),
            new Vec3(half, half, 0.0),
            new Vec3(half, -half, 0.0),
            new Vec3(-half, -half, 0.0)];
    };

    init(): void {
        let d = new Vec3(), v = new Mat3(), u;

        this.modelVectors = Mat3.fromRows(
            Vec3.sub(this.model[1], this.model[0]),
            Vec3.sub(this.model[2], this.model[0]),
            Vec3.sub(this.model[3], this.model[0]));

        u = Mat3.clone(this.modelVectors);

        SVD.svdcmp(u.m, 3, 3, d.v, v.m);

        this.modelPseudoInverse = Mat3.mult(
            Mat3.mult(v, Mat3.fromDiagonal(Vec3.inverse(d))), Mat3.transpose(u));

        this.modelNormal = v.column(d.minIndex());
    };

    pose(points: Point[]): Pose {
        let eps = new Vec3(1.0, 1.0, 1.0),
            rotation1 = new Mat3(), rotation2 = new Mat3(),
            translation1 = new Vec3(), translation2 = new Vec3(),
            error1: number, error2: number;

        this.pos(points, eps, rotation1, rotation2, translation1, translation2);

        error1 = this.iterate(points, rotation1, translation1);
        error2 = this.iterate(points, rotation2, translation2);

        return error1 < error2 ?
            new Pose(error1, rotation1.m, translation1.v, error2, rotation2.m, translation2.v) :
            new Pose(error2, rotation2.m, translation2.v, error1, rotation1.m, translation1.v);
    };

    pos(points: Point[], eps: Vec3, rotation1: Mat3, rotation2: Mat3, translation1: Vec3, translation2: Vec3): void {
        let xi = new Vec3(points[1].x, points[2].x, points[3].x),
            yi = new Vec3(points[1].y, points[2].y, points[3].y),
            xs = Vec3.addScalar(Vec3.mult(xi, eps), -points[0].x),
            ys = Vec3.addScalar(Vec3.mult(yi, eps), -points[0].y),
            i0 = Mat3.multVector(this.modelPseudoInverse, xs),
            j0 = Mat3.multVector(this.modelPseudoInverse, ys),
            s = j0.square() - i0.square(),
            ij = Vec3.dot(i0, j0),
            r = 0.0, theta = 0.0,
            i, j, k, inorm, jnorm, scale, temp, lambda, mu;

        if (0.0 === s) {
            r = Math.sqrt(Math.abs(2.0 * ij));
            theta = (-Math.PI / 2.0) * (ij < 0.0 ? -1 : (ij > 0.0 ? 1.0 : 0.0));
        } else {
            r = Math.sqrt(Math.sqrt(s * s + 4.0 * ij * ij));
            theta = Math.atan(-2.0 * ij / s);
            if (s < 0.0) {
                theta += Math.PI;
            }
            theta /= 2.0;
        }

        lambda = r * Math.cos(theta);
        mu = r * Math.sin(theta);

        //First possible rotation/translation
        i = Vec3.add(i0, Vec3.multScalar(this.modelNormal, lambda));
        j = Vec3.add(j0, Vec3.multScalar(this.modelNormal, mu));
        inorm = i.normalize();
        jnorm = j.normalize();
        k = Vec3.cross(i, j);
        rotation1.copy(Mat3.fromRows(i, j, k));

        scale = (inorm + jnorm) / 2.0;
        temp = Mat3.multVector(rotation1, this.model[0]);
        translation1.v = [
            points[0].x / scale - temp.v[0],
            points[0].y / scale - temp.v[1],
            this.focalLength / scale];

        //Second possible rotation/translation
        i = Vec3.sub(i0, Vec3.multScalar(this.modelNormal, lambda));
        j = Vec3.sub(j0, Vec3.multScalar(this.modelNormal, mu));
        inorm = i.normalize();
        jnorm = j.normalize();
        k = Vec3.cross(i, j);
        rotation2.copy(Mat3.fromRows(i, j, k));

        scale = (inorm + jnorm) / 2.0;
        temp = Mat3.multVector(rotation2, this.model[0]);
        translation2.v = [
            points[0].x / scale - temp.v[0],
            points[0].y / scale - temp.v[1],
            this.focalLength / scale];
    };

    iterate(points: Point[], rotation: Mat3, translation: Vec3): number {
        let prevError = Infinity,
            rotation1 = new Mat3(), rotation2 = new Mat3(),
            translation1 = new Vec3(), translation2 = new Vec3(),
            i = 0, eps, error, error1, error2;

        for (; i < 100; ++i) {
            eps = Vec3.addScalar(Vec3.multScalar(
                Mat3.multVector(this.modelVectors, rotation.row(2)), 1.0 / translation.v[2]), 1.0);

            this.pos(points, eps, rotation1, rotation2, translation1, translation2);

            error1 = this.getError(points, rotation1, translation1);
            error2 = this.getError(points, rotation2, translation2);

            if (error1 < error2) {
                rotation.copy(rotation1);
                translation.copy(translation1);
                error = error1;
            } else {
                rotation.copy(rotation2);
                translation.copy(translation2);
                error = error2;
            }

            if ((error <= 2.0) || (error > prevError)) {
                break;
            }

            prevError = error;
        }

        return error;
    };

    getError(points: Point[], rotation: Mat3, translation: Vec3): number {
        let v1 = Vec3.add(Mat3.multVector(rotation, this.model[0]), translation),
            v2 = Vec3.add(Mat3.multVector(rotation, this.model[1]), translation),
            v3 = Vec3.add(Mat3.multVector(rotation, this.model[2]), translation),
            v4 = Vec3.add(Mat3.multVector(rotation, this.model[3]), translation),
            modeled: Point[], ia1: number, ia2: number, ia3: number, ia4: number, 
            ma1: number, ma2: number, ma3: number, ma4: number;

        // Convert Vec3 objects to projected 2D points
        modeled = [
            {x: v1.v[0] * this.focalLength / v1.v[2], y: v1.v[1] * this.focalLength / v1.v[2]},
            {x: v2.v[0] * this.focalLength / v2.v[2], y: v2.v[1] * this.focalLength / v2.v[2]},
            {x: v3.v[0] * this.focalLength / v3.v[2], y: v3.v[1] * this.focalLength / v3.v[2]},
            {x: v4.v[0] * this.focalLength / v4.v[2], y: v4.v[1] * this.focalLength / v4.v[2]}
        ];

        ia1 = this.angle(points[0], points[1], points[3]);
        ia2 = this.angle(points[1], points[2], points[0]);
        ia3 = this.angle(points[2], points[3], points[1]);
        ia4 = this.angle(points[3], points[0], points[2]);

        ma1 = this.angle(modeled[0], modeled[1], modeled[3]);
        ma2 = this.angle(modeled[1], modeled[2], modeled[0]);
        ma3 = this.angle(modeled[2], modeled[3], modeled[1]);
        ma4 = this.angle(modeled[3], modeled[0], modeled[2]);

        return (Math.abs(ia1 - ma1) +
            Math.abs(ia2 - ma2) +
            Math.abs(ia3 - ma3) +
            Math.abs(ia4 - ma4)) / 4.0;
    };

    angle(a: Point, b: Point, c: Point): number {
        const x1 = b.x - a.x, y1 = b.y - a.y,
            x2 = c.x - a.x, y2 = c.y - a.y;

        return Math.acos((x1 * x2 + y1 * y2) /
            (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2))) * 180.0 / Math.PI;
    };
}

export class Pose {
    public bestError: number;
    public bestRotation: number[][];
    public bestTranslation: number[];
    public alternativeError: number;
    public alternativeRotation: number[][];
    public alternativeTranslation: number[];

    constructor(error1: number, rotation1: number[][], translation1: number[], 
                error2: number, rotation2: number[][], translation2: number[]) {
        this.bestError = error1;
        this.bestRotation = rotation1;
        this.bestTranslation = translation1;
        this.alternativeError = error2;
        this.alternativeRotation = rotation2;
        this.alternativeTranslation = translation2;
    };
}