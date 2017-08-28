// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import Viewport from './viewport';
import {Matrix4, experimental} from 'math.gl';
const {SphericalCoordinates} = experimental;

// import {projectFlat} from '../viewport-mercator-project/web-mercator-utils';
// import assert from 'assert';

function getDirectionFromBearingAndPitch({bearing, pitch}) {
  const spherical = new SphericalCoordinates({bearing, pitch});
  const direction = spherical.toVector3().normalize();
  return direction;
}

export default class FirstPersonViewport extends Viewport {
  constructor(opts = {}) {
    // TODO - push direction handling into Matrix4.lookAt
    const {
      // view matrix arguments
      bearing,
      // pitch,
      lookAt, // Which point is camera looking at, default along y axis
      direction, // Which direction camera is looking at
      up = [0, 1, 0] // Defines up direction, default positive y axis,
    } = opts;

    const eye = opts.eye || opts.position; // Defines eye position
    // const dir = direction ||
    //   getDirectionFromBearingAndPitch({bearing, pitch: 90}).scale([1, -1, 1]);
    // const center = dir ? new Vector3(eye).add(dir) : lookAt;
    const dir = direction || getDirectionFromBearingAndPitch({
      bearing: 180 - bearing,
      pitch: 90
    });

    // web mercator world is positive towards south

    // .scale([1, -1, 1]);
    const center = dir ? dir : lookAt;

    const viewMatrix = new Matrix4()
      .multiplyRight(new Matrix4().lookAt({eye: [0, 0, 0], center, up}));

    super(Object.assign({}, opts, {
      viewMatrix,
      position: eye
    }));
  }
}
