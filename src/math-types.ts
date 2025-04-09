export class Vec3 {
    public v;

    constructor(x?: number, y?: number, z?: number) {
        this.v = [x || 0.0, y || 0.0, z || 0.0];
    }

    copy(a: any): Vec3 {
        let v = this.v;
        a = a.v;

        v[0] = a[0];
        v[1] = a[1];
        v[2] = a[2];

        return this;
    }

    static add(a: any, b: any): Vec3 {
        const vector = new Vec3(), v = vector.v;

        a = a.v;
        b = b.v;

        v[0] = a[0] + b[0];
        v[1] = a[1] + b[1];
        v[2] = a[2] + b[2];

        return vector;
    }

    static sub(a: any, b: any): Vec3 {
        const vector = new Vec3(), v = vector.v;

        a = a.v;
        b = b.v;

        v[0] = a[0] - b[0];
        v[1] = a[1] - b[1];
        v[2] = a[2] - b[2];

        return vector;
    }

    static mult(a: any, b: any): Vec3 {
        const vector = new Vec3(), v = vector.v;

        a = a.v;
        b = b.v;

        v[0] = a[0] * b[0];
        v[1] = a[1] * b[1];
        v[2] = a[2] * b[2];

        return vector;
    }

    static addScalar(a: any, b: number): Vec3 {
        const vector = new Vec3(), v = vector.v;

        a = a.v;

        v[0] = a[0] + b;
        v[1] = a[1] + b;
        v[2] = a[2] + b;

        return vector;
    }

    static multScalar(a: any, b: number): Vec3 {
        const vector = new Vec3(), v = vector.v;

        a = a.v;

        v[0] = a[0] * b;
        v[1] = a[1] * b;
        v[2] = a[2] * b;

        return vector;
    }

    static dot(a: any, b: any): number {
        a = a.v;
        b = b.v;

        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    static cross(a: any, b: any): Vec3 {
        a = a.v;
        b = b.v;

        return new Vec3(
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        );
    }

    normalize(): number {
        const v = this.v,
            len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

        if (len > 0.0) {
            v[0] /= len;
            v[1] /= len;
            v[2] /= len;
        }

        return len;
    }

    static inverse(a: any): Vec3 {
        const vector = new Vec3(), v = vector.v;

        a = a.v;

        if (a[0] !== 0.0) {
            v[0] = 1.0 / a[0];
        }
        if (a[1] !== 0.0) {
            v[1] = 1.0 / a[1];
        }
        if (a[2] !== 0.0) {
            v[2] = 1.0 / a[2];
        }

        return vector;
    }

    square(): number {
        const v = this.v;

        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }

    minIndex(): number {
        const v = this.v;

        return v[0] < v[1] ? (v[0] < v[2] ? 0 : 2) : (v[1] < v[2] ? 1 : 2);
    }
}

export class Mat3 {
    public m: number[][];

    constructor() {
        this.m = [
            [0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0],
        ];
    }

    static clone(a: any): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;
        a = a.m;

        m[0][0] = a[0][0];
        m[0][1] = a[0][1];
        m[0][2] = a[0][2];
        m[1][0] = a[1][0];
        m[1][1] = a[1][1];
        m[1][2] = a[1][2];
        m[2][0] = a[2][0];
        m[2][1] = a[2][1];
        m[2][2] = a[2][2];

        return matrix;
    }

    copy(a: any): Mat3 {
        const m = this.m;
        a = a.m;

        m[0][0] = a[0][0];
        m[0][1] = a[0][1];
        m[0][2] = a[0][2];
        m[1][0] = a[1][0];
        m[1][1] = a[1][1];
        m[1][2] = a[1][2];
        m[2][0] = a[2][0];
        m[2][1] = a[2][1];
        m[2][2] = a[2][2];

        return this;
    }

    static fromRows(a: any, b: any, c: any): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;

        a = a.v;
        b = b.v;
        c = c.v;

        m[0][0] = a[0];
        m[0][1] = a[1];
        m[0][2] = a[2];
        m[1][0] = b[0];
        m[1][1] = b[1];
        m[1][2] = b[2];
        m[2][0] = c[0];
        m[2][1] = c[1];
        m[2][2] = c[2];

        return matrix;
    }

    static fromDiagonal(a: any): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;

        a = a.v;

        m[0][0] = a[0];
        m[1][1] = a[1];
        m[2][2] = a[2];

        return matrix;
    }

    static transpose(a: any): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;

        a = a.m;

        m[0][0] = a[0][0];
        m[0][1] = a[1][0];
        m[0][2] = a[2][0];
        m[1][0] = a[0][1];
        m[1][1] = a[1][1];
        m[1][2] = a[2][1];
        m[2][0] = a[0][2];
        m[2][1] = a[1][2];
        m[2][2] = a[2][2];

        return matrix;
    }

    static mult(a: any, b: any): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;

        a = a.m;
        b = b.m;

        m[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0];
        m[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1];
        m[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2];
        m[1][0] = a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0];
        m[1][1] = a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1];
        m[1][2] = a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2];
        m[2][0] = a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0];
        m[2][1] = a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1];
        m[2][2] = a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2];

        return matrix;
    }

    static multVector(m: any, a: any): Vec3 {
        m = m.m;
        a = a.v;

        return new Vec3(
            m[0][0] * a[0] + m[0][1] * a[1] + m[0][2] * a[2],
            m[1][0] * a[0] + m[1][1] * a[1] + m[1][2] * a[2],
            m[2][0] * a[0] + m[2][1] * a[1] + m[2][2] * a[2]
        );
    }

    column(index: number): Vec3 {
        const m = this.m;

        return new Vec3(m[0][index], m[1][index], m[2][index]);
    }

    row(index: number): Vec3 {
        const m = this.m;

        return new Vec3(m[index][0], m[index][1], m[index][2]);
    }
}
