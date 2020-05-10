// Copyright 2014 Emilie Gillet.
//
// Author: Emilie Gillet (emilie.o.gillet@gmail.com)
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
// 
// See http://creativecommons.org/licenses/MIT/ for more information.
//
// -----------------------------------------------------------------------------
//
// Chorus.

#ifndef RINGS_DSP_FX_CHORUS_H_
#define RINGS_DSP_FX_CHORUS_H_

#include "stmlib/stmlib.h"

#include "stmlib/dsp/dsp.h"

#include "rings/dsp/fx/fx_engine.h"
#include "rings/resources.h"

namespace rings {

class Chorus {
 public:
  Chorus() { }
  ~Chorus() { }
  
  void Init(uint16_t* buffer) {
    engine_.Init(buffer);
    phase_1_ = 0;
    phase_2_ = 0;
  }
  
  void Process(double* left, double* right, size_t size) {
    typedef E::Reserve<2047> Memory;
    E::DelayLine<Memory, 0> line;
    E::Context c;
    
    while (size--) {
      engine_.Start(&c);
      double dry_amount = 1.0 - amount_ * 0.5;
    
      // Update LFO.
      phase_1_ += 4.17e-06;
      if (phase_1_ >= 1.0) {
        phase_1_ -= 1.0f;
      }
      phase_2_ += 5.417e-06;
      if (phase_2_ >= 1.0) {
        phase_2_ -= 1.0;
      }
      double sin_1 = stmlib::Interpolate(lut_sine, phase_1_, 4096.0);
      double cos_1 = stmlib::Interpolate(lut_sine, phase_1_ + 0.25, 4096.0);
      double sin_2 = stmlib::Interpolate(lut_sine, phase_2_, 4096.0);
      double cos_2 = stmlib::Interpolate(lut_sine, phase_2_ + 0.25, 4096.0);
    
      double wet;
    
      // Sum L & R channel to send to chorus line.
      c.Read(*left, 0.5);
      c.Read(*right, 0.5);
      c.Write(line, 0.0);
    
      c.Interpolate(line, sin_1 * depth_ + 1200, 0.5);
      c.Interpolate(line, sin_2 * depth_ + 800, 0.5);
      c.Write(wet, 0.0);
      *left = wet * amount_ + *left * dry_amount;
      
      c.Interpolate(line, cos_1 * depth_ + 800 + cos_2 * 0, 0.5);
      c.Interpolate(line, cos_2 * depth_ + 1200, 0.5);
      c.Write(wet, 0.0);
      *right = wet * amount_ + *right * dry_amount;
      left++;
      right++;
    }
  }
  
  inline void set_amount(double amount) {
    amount_ = amount;
  }
  
  inline void set_depth(double depth) {
    depth_ = depth * 384.0;
  }
  
 private:
  typedef FxEngine<2048, FORMAT_16_BIT> E;
  E engine_;
  
  double amount_;
  double depth_;
  
  double phase_1_;
  double phase_2_;
  
  DISALLOW_COPY_AND_ASSIGN(Chorus);
};

}  // namespace rings

#endif  // RINGS_DSP_FX_CHORUS_H_
