import { Posit, Pose } from "../src/posit";
import { IPoint } from "../src/math-types";

/**
 * Tests for Posit class
 */

describe("Posit.buildModel", () => {
  it("builds a square model centered at origin with given size", () => {
    const modelSize = 100;
    const f = 1000;
    const posit = new Posit(modelSize, f);
    const half = modelSize / 2;
    expect(posit.model).toHaveLength(4);
    expect(posit.model[0].v).toEqual([-half, half, 0]);
    expect(posit.model[1].v).toEqual([half, half, 0]);
    expect(posit.model[2].v).toEqual([half, -half, 0]);
    expect(posit.model[3].v).toEqual([-half, -half, 0]);
  });
});

describe("Posit.angle", () => {
  it("returns the angle in degrees between AB and AC", () => {
    const posit = new Posit(100, 1000);
    // Right angle at A = (0,0), B = (1,0), C = (0,1)
    const A = { x: 0, y: 0 } as IPoint;
    const B = { x: 1, y: 0 } as IPoint;
    const C = { x: 0, y: 1 } as IPoint;
    const ang = posit.angle(A, B, C);
    expect(ang).toBeCloseTo(90, 12);
  });
});

describe("Posit.pose", () => {
  it("estimates near-zero error for a front-facing square at Z = f", () => {
    const modelSize = 80; // world units
    const f = 800; // focal length
    const posit = new Posit(modelSize, f);
    const half = modelSize / 2;

    // If the object is front-facing with rotation=I and translation z = f,
    // projection is x' = f*X/Z = X (since Z=f). So 2D points equal model X,Y.
    const points: IPoint[] = [
      { x: -half, y: half },
      { x: half, y: half },
      { x: half, y: -half },
      { x: -half, y: -half },
    ];

    const pose: Pose = posit.pose(points);

    // Best error should be very small (numerical noise tolerated)
    expect(pose.bestError).toBeLessThan(1e-3); // ~0.001 degrees is acceptable for numerical accuracy

    // Sanity: translations should have positive Z around f, and small X,Y
    expect(pose.bestTranslation[2]).toBeGreaterThan(0);
    expect(pose.bestTranslation[2]).toBeCloseTo(f, -1); // loose check, digits not enforced
    expect(Math.abs(pose.bestTranslation[0])).toBeLessThan(1e-6);
    expect(Math.abs(pose.bestTranslation[1])).toBeLessThan(1e-6);
  });
});
