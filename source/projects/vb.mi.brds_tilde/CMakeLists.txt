include(${CMAKE_CURRENT_SOURCE_DIR}/../../max-sdk-base/script/max-pretarget.cmake)

# paths to our sources
set(MUTABLE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../../mutableSources32")
set(STMLIB_PATH ${MUTABLE_PATH}/stmlib)
set(MI_PATH ${MUTABLE_PATH}/braids)


set(STMLIB_SOURCES 
	${STMLIB_PATH}/stmlib.h
	${STMLIB_PATH}/utils/random.cc
	${STMLIB_PATH}/utils/random.h
	${STMLIB_PATH}/utils/dsp.h
	${STMLIB_PATH}/dsp/atan.cc
	${STMLIB_PATH}/dsp/atan.h
	${STMLIB_PATH}/dsp/units.cc
	${STMLIB_PATH}/dsp/units.h
	${STMLIB_PATH}/dsp/dsp.h
)

set(MI_SOURCES
	${MI_PATH}/analog_oscillator.cc
	${MI_PATH}/analog_oscillator.h
	${MI_PATH}/digital_oscillator.cc
	${MI_PATH}/digital_oscillator.h
	${MI_PATH}/envelope.h
	${MI_PATH}/excitation.h
	${MI_PATH}/macro_oscillator.cc
	${MI_PATH}/macro_oscillator.h
	${MI_PATH}/parameter_interpolation.h
	${MI_PATH}/quantizer.cc
	${MI_PATH}/quantizer.h
	${MI_PATH}/quantizer_scales.h
	${MI_PATH}/resources.cc
	${MI_PATH}/resources.h
	${MI_PATH}/signature_waveshaper.h
	${MI_PATH}/vco_jitter_source.h
)

set(BUILD_SOURCES 
	${PROJECT_NAME}.cpp
)


include_directories( 
	"${C74_INCLUDES}"
)



add_library( 
	${PROJECT_NAME} 
	MODULE
	${STMLIB_SOURCES}
	${MI_SOURCES}
	${BUILD_SOURCES}
)

target_include_directories(${PROJECT_NAME}
	PUBLIC
	${MUTABLE_PATH}
	${HOMEBREW_PREFIX}/include
)


# add preprocessor macro TEST to avoid asm functions
target_compile_definitions(${PROJECT_NAME} PUBLIC TEST)

# create groups in our project
source_group(TREE ${MUTABLE_PATH} FILES ${MI_SOURCES} ${STMLIB_SOURCES})


target_link_libraries(${PROJECT_NAME}
	PUBLIC 
	${HOMEBREW_PREFIX}/lib/libsamplerate.a
	"-framework Accelerate"
)

        
include(${CMAKE_CURRENT_SOURCE_DIR}/../../max-sdk-base/script/max-posttarget.cmake)

message("using CXX_STANDARD ${CMAKE_CXX_STANDARD}")
