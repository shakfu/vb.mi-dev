// from elements/dsp/resonator.cc Resonator::ComputeFilters()

outlets = 2;


var kMaxModes = 64;
var freqs = [64];
var qs = [64];

var geometry_ = 0.1;
var frequency_ = 0.01;
var damping_ = 0.1;
var brightness_ = 0.1;



function geometry(input) {
	geometry_ = clip(input, 0, 1);
	computeFilters();
}

function frequency(input) {
	frequency_ = clip(input, 0, 1);
	computeFilters();
}

function damping(input) {
	damping_ = clip(input, 0, 1);
	computeFilters();
}

function brightness(input) {
	brightness_ = clip(input, 0, 1);
	computeFilters();
}

function computeFilters() 
{
	var stiffness = Interpolate(lut_stiffness, geometry_, 256);
 	var harmonic = frequency_;
  	var stretch_factor = 1.0; 
 	var q = 500. * Interpolate(lut_4_decades, damping_ * 0.8, 256);
  	var brightness_attenuation = 1.0 - geometry_;


  // Reduces the range of brightness when geometry is very low, to prevent
  // clipping.
  	brightness_attenuation *= brightness_attenuation;
  	brightness_attenuation *= brightness_attenuation;
  	brightness_attenuation *= brightness_attenuation;
  	var brightness = brightness_ * (1.0 - 0.2 * brightness_attenuation);
  	var q_loss = brightness * (2.0 - brightness) * 0.85 + 0.15;
  	var q_loss_damping_rate = geometry_ * (2.0 - geometry_) * 0.1;
  	var num_modes = 0;
	//for (size_t i = 0; i < min(kMaxModes, resolution_); ++i) 
  	for (i = 0; i < kMaxModes; ++i) {

    	var partial_frequency = harmonic * stretch_factor;
    	if (partial_frequency >= 0.49) {
      		partial_frequency = 0.49;
    	} /*else {
      		num_modes = i + 1;
    	}*/

      	//f_[i].set_f_q<FREQUENCY_FAST>(
          //partial_frequency,
          //1.0f + partial_frequency * q);
		freqs[i] = partial_frequency;
		qs[i] = 1 + partial_frequency * q;
	
	/*
      if (i < kMaxBowedModes) {
        size_t period = 1.0f / partial_frequency;
        while (period >= kMaxDelayLineSize) period >>= 1;
        d_bow_[i].set_delay(period);
        f_bow_[i].set_g_q(f_[i].g(), 1.0f + partial_frequency * 1500.0f);
      }*/
    
    	stretch_factor += stiffness;
    	if (stiffness < 0.0) {
      // Make sure that the partials do not fold back into negative frequencies.
      		stiffness *= 0.93;
    	} else {
      // This helps adding a few extra partials in the highest frequencies.
      		stiffness *= 0.98;
    	}
    	// This prevents the highest partials from decaying too fast.
    	q_loss += q_loss_damping_rate * (1.0 - q_loss);
    	harmonic += frequency_;
    	q *= q_loss;
  	}
  
 	//return num_modes;
	outlet(1, qs);
	outlet(0, freqs);
}



function Interpolate(table, index, tsize) {
	index *= tsize;
	var index_integral = Math.floor(index);
	var index_fractional = index - index_integral;
	var a = table[index_integral];
	var b = table[index_integral+1];
	return a + (b-a) * index_fractional;
}


function clip(x, a, b) {
	return Math.max(a, Math.min(x, b));
}

/*
function geometry(g) {
	
	stiffness = Interpolate(lut_stiffness, g, 256);
	//post("stiffness: ", stiffness, "\n");
	outlet(0, stiffness);
	return stiffness;
}
*/



var lut_4_decades = [
   1.000000000e+00,  1.036632928e+00,  1.074607828e+00,  1.113973860e+00,
   1.154781985e+00,  1.197085030e+00,  1.240937761e+00,  1.286396945e+00,
   1.333521432e+00,  1.382372227e+00,  1.433012570e+00,  1.485508017e+00,
   1.539926526e+00,  1.596338544e+00,  1.654817100e+00,  1.715437896e+00,
   1.778279410e+00,  1.843422992e+00,  1.910952975e+00,  1.980956779e+00,
   2.053525026e+00,  2.128751662e+00,  2.206734069e+00,  2.287573200e+00,
   2.371373706e+00,  2.458244069e+00,  2.548296748e+00,  2.641648320e+00,
   2.738419634e+00,  2.838735965e+00,  2.942727176e+00,  3.050527890e+00,
   3.162277660e+00,  3.278121151e+00,  3.398208329e+00,  3.522694651e+00,
   3.651741273e+00,  3.785515249e+00,  3.924189758e+00,  4.067944321e+00,
   4.216965034e+00,  4.371444813e+00,  4.531583638e+00,  4.697588817e+00,
   4.869675252e+00,  5.048065717e+00,  5.232991147e+00,  5.424690937e+00,
   5.623413252e+00,  5.829415347e+00,  6.042963902e+00,  6.264335367e+00,
   6.493816316e+00,  6.731703824e+00,  6.978305849e+00,  7.233941627e+00,
   7.498942093e+00,  7.773650302e+00,  8.058421878e+00,  8.353625470e+00,
   8.659643234e+00,  8.976871324e+00,  9.305720409e+00,  9.646616199e+00,
   1.000000000e+01,  1.036632928e+01,  1.074607828e+01,  1.113973860e+01,
   1.154781985e+01,  1.197085030e+01,  1.240937761e+01,  1.286396945e+01,
   1.333521432e+01,  1.382372227e+01,  1.433012570e+01,  1.485508017e+01,
   1.539926526e+01,  1.596338544e+01,  1.654817100e+01,  1.715437896e+01,
   1.778279410e+01,  1.843422992e+01,  1.910952975e+01,  1.980956779e+01,
   2.053525026e+01,  2.128751662e+01,  2.206734069e+01,  2.287573200e+01,
   2.371373706e+01,  2.458244069e+01,  2.548296748e+01,  2.641648320e+01,
   2.738419634e+01,  2.838735965e+01,  2.942727176e+01,  3.050527890e+01,
   3.162277660e+01,  3.278121151e+01,  3.398208329e+01,  3.522694651e+01,
   3.651741273e+01,  3.785515249e+01,  3.924189758e+01,  4.067944321e+01,
   4.216965034e+01,  4.371444813e+01,  4.531583638e+01,  4.697588817e+01,
   4.869675252e+01,  5.048065717e+01,  5.232991147e+01,  5.424690937e+01,
   5.623413252e+01,  5.829415347e+01,  6.042963902e+01,  6.264335367e+01,
   6.493816316e+01,  6.731703824e+01,  6.978305849e+01,  7.233941627e+01,
   7.498942093e+01,  7.773650302e+01,  8.058421878e+01,  8.353625470e+01,
   8.659643234e+01,  8.976871324e+01,  9.305720409e+01,  9.646616199e+01,
   1.000000000e+02,  1.036632928e+02,  1.074607828e+02,  1.113973860e+02,
   1.154781985e+02,  1.197085030e+02,  1.240937761e+02,  1.286396945e+02,
   1.333521432e+02,  1.382372227e+02,  1.433012570e+02,  1.485508017e+02,
   1.539926526e+02,  1.596338544e+02,  1.654817100e+02,  1.715437896e+02,
   1.778279410e+02,  1.843422992e+02,  1.910952975e+02,  1.980956779e+02,
   2.053525026e+02,  2.128751662e+02,  2.206734069e+02,  2.287573200e+02,
   2.371373706e+02,  2.458244069e+02,  2.548296748e+02,  2.641648320e+02,
   2.738419634e+02,  2.838735965e+02,  2.942727176e+02,  3.050527890e+02,
   3.162277660e+02,  3.278121151e+02,  3.398208329e+02,  3.522694651e+02,
   3.651741273e+02,  3.785515249e+02,  3.924189758e+02,  4.067944321e+02,
   4.216965034e+02,  4.371444813e+02,  4.531583638e+02,  4.697588817e+02,
   4.869675252e+02,  5.048065717e+02,  5.232991147e+02,  5.424690937e+02,
   5.623413252e+02,  5.829415347e+02,  6.042963902e+02,  6.264335367e+02,
   6.493816316e+02,  6.731703824e+02,  6.978305849e+02,  7.233941627e+02,
   7.498942093e+02,  7.773650302e+02,  8.058421878e+02,  8.353625470e+02,
   8.659643234e+02,  8.976871324e+02,  9.305720409e+02,  9.646616199e+02,
   1.000000000e+03,  1.036632928e+03,  1.074607828e+03,  1.113973860e+03,
   1.154781985e+03,  1.197085030e+03,  1.240937761e+03,  1.286396945e+03,
   1.333521432e+03,  1.382372227e+03,  1.433012570e+03,  1.485508017e+03,
   1.539926526e+03,  1.596338544e+03,  1.654817100e+03,  1.715437896e+03,
   1.778279410e+03,  1.843422992e+03,  1.910952975e+03,  1.980956779e+03,
   2.053525026e+03,  2.128751662e+03,  2.206734069e+03,  2.287573200e+03,
   2.371373706e+03,  2.458244069e+03,  2.548296748e+03,  2.641648320e+03,
   2.738419634e+03,  2.838735965e+03,  2.942727176e+03,  3.050527890e+03,
   3.162277660e+03,  3.278121151e+03,  3.398208329e+03,  3.522694651e+03,
   3.651741273e+03,  3.785515249e+03,  3.924189758e+03,  4.067944321e+03,
   4.216965034e+03,  4.371444813e+03,  4.531583638e+03,  4.697588817e+03,
   4.869675252e+03,  5.048065717e+03,  5.232991147e+03,  5.424690937e+03,
   5.623413252e+03,  5.829415347e+03,  6.042963902e+03,  6.264335367e+03,
   6.493816316e+03,  6.731703824e+03,  6.978305849e+03,  7.233941627e+03,
   7.498942093e+03,  7.773650302e+03,  8.058421878e+03,  8.353625470e+03,
   8.659643234e+03,  8.976871324e+03,  9.305720409e+03,  9.646616199e+03,
   1.000000000e+04
];



var lut_stiffness = [
  -6.250000000e-02, -6.152343750e-02, -6.054687500e-02, -5.957031250e-02,
  -5.859375000e-02, -5.761718750e-02, -5.664062500e-02, -5.566406250e-02,
  -5.468750000e-02, -5.371093750e-02, -5.273437500e-02, -5.175781250e-02,
  -5.078125000e-02, -4.980468750e-02, -4.882812500e-02, -4.785156250e-02,
  -4.687500000e-02, -4.589843750e-02, -4.492187500e-02, -4.394531250e-02,
  -4.296875000e-02, -4.199218750e-02, -4.101562500e-02, -4.003906250e-02,
  -3.906250000e-02, -3.808593750e-02, -3.710937500e-02, -3.613281250e-02,
  -3.515625000e-02, -3.417968750e-02, -3.320312500e-02, -3.222656250e-02,
  -3.125000000e-02, -3.027343750e-02, -2.929687500e-02, -2.832031250e-02,
  -2.734375000e-02, -2.636718750e-02, -2.539062500e-02, -2.441406250e-02,
  -2.343750000e-02, -2.246093750e-02, -2.148437500e-02, -2.050781250e-02,
  -1.953125000e-02, -1.855468750e-02, -1.757812500e-02, -1.660156250e-02,
  -1.562500000e-02, -1.464843750e-02, -1.367187500e-02, -1.269531250e-02,
  -1.171875000e-02, -1.074218750e-02, -9.765625000e-03, -8.789062500e-03,
  -7.812500000e-03, -6.835937500e-03, -5.859375000e-03, -4.882812500e-03,
  -3.906250000e-03, -2.929687500e-03, -1.953125000e-03, -9.765625000e-04,
   0.000000000e+00,  0.000000000e+00,  0.000000000e+00,  0.000000000e+00,
   0.000000000e+00,  0.000000000e+00,  0.000000000e+00,  0.000000000e+00,
   0.000000000e+00,  0.000000000e+00,  0.000000000e+00,  0.000000000e+00,
   0.000000000e+00,  6.029410294e-05,  3.672617230e-04,  6.835957809e-04,
   1.009582073e-03,  1.345515115e-03,  1.691698412e-03,  2.048444725e-03,
   2.416076364e-03,  2.794925468e-03,  3.185334315e-03,  3.587655624e-03,
   4.002252878e-03,  4.429500650e-03,  4.869784943e-03,  5.323503537e-03,
   5.791066350e-03,  6.272895808e-03,  6.769427226e-03,  7.281109202e-03,
   7.808404022e-03,  8.351788076e-03,  8.911752293e-03,  9.488802580e-03,
   1.008346028e-02,  1.069626264e-02,  1.132776331e-02,  1.197853283e-02,
   1.264915914e-02,  1.334024813e-02,  1.405242417e-02,  1.478633069e-02,
   1.554263074e-02,  1.632200761e-02,  1.712516545e-02,  1.795282987e-02,
   1.880574864e-02,  1.968469234e-02,  2.059045506e-02,  2.152385512e-02,
   2.248573583e-02,  2.347696619e-02,  2.449844176e-02,  2.555108540e-02,
   2.663584813e-02,  2.775370999e-02,  2.890568094e-02,  3.009280173e-02,
   3.131614488e-02,  3.257681565e-02,  3.387595299e-02,  3.521473064e-02,
   3.659435812e-02,  3.801608189e-02,  3.948118641e-02,  4.099099536e-02,
   4.254687278e-02,  4.415022437e-02,  4.580249868e-02,  4.750518848e-02,
   4.925983210e-02,  5.106801479e-02,  5.293137017e-02,  5.485158172e-02,
   5.683038428e-02,  5.886956562e-02,  6.097096806e-02,  6.313649016e-02,
   6.536808837e-02,  6.766777886e-02,  7.003763933e-02,  7.247981084e-02,
   7.499649981e-02,  7.758997998e-02,  8.026259446e-02,  8.301675786e-02,
   8.585495846e-02,  8.877976048e-02,  9.179380636e-02,  9.489981918e-02,
   9.810060511e-02,  1.013990559e-01,  1.047981517e-01,  1.083009634e-01,
   1.119106556e-01,  1.156304895e-01,  1.194638260e-01,  1.234141283e-01,
   1.274849653e-01,  1.316800149e-01,  1.360030671e-01,  1.404580277e-01,
   1.450489216e-01,  1.497798965e-01,  1.546552266e-01,  1.596793166e-01,
   1.648567056e-01,  1.701920711e-01,  1.756902336e-01,  1.813561603e-01,
   1.871949702e-01,  1.932119385e-01,  1.994125013e-01,  2.058022605e-01,
   2.123869891e-01,  2.191726361e-01,  2.261653322e-01,  2.333713949e-01,
   2.407973346e-01,  2.484498605e-01,  2.563358863e-01,  2.644625367e-01,
   2.728371538e-01,  2.814673039e-01,  2.903607839e-01,  2.995256288e-01,
   3.089701187e-01,  3.187027863e-01,  3.287324247e-01,  3.390680953e-01,
   3.497191360e-01,  3.606951697e-01,  3.720061128e-01,  3.836621843e-01,
   3.956739150e-01,  4.080521572e-01,  4.208080940e-01,  4.339532500e-01,
   4.474995013e-01,  4.614590865e-01,  4.758446177e-01,  4.906690914e-01,
   5.059459012e-01,  5.216888491e-01,  5.379121581e-01,  5.546304856e-01,
   5.718589358e-01,  5.896130741e-01,  6.079089407e-01,  6.267630651e-01,
   6.461924814e-01,  6.662147434e-01,  6.868479405e-01,  7.081107139e-01,
   7.300222738e-01,  7.526024164e-01,  7.758715422e-01,  7.998506739e-01,
   8.245614757e-01,  8.500262730e-01,  8.762680723e-01,  9.033105820e-01,
   9.311782340e-01,  9.598962059e-01,  9.894904431e-01,  1.000000745e+00,
   1.000037649e+00,  1.000262504e+00,  1.000964607e+00,  1.002570034e+00,
   1.005639154e+00,  1.010861180e+00,  1.019043988e+00,  1.031097087e+00,
   1.048005353e+00,  1.070791059e+00,  1.100461817e+00,  1.137942574e+00,
   1.183990632e+00,  1.239094135e+00,  1.303356514e+00,  1.376372085e+00,
   1.457101344e+00,  1.543758274e+00,  1.633725943e+00,  1.723520185e+00,
   1.808823654e+00,  1.884612937e+00,  1.945398753e+00,  2.000000000e+00,
   2.000000000e+00
];



