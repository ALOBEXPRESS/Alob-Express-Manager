"use client";
import { useState, useEffect } from "react";

const ThemeLayer = () => {
  const [previewImage1, setPreviewImage1] = useState("");
  const [previewImage2, setPreviewImage2] = useState("");
  const [activeThemeColor, setActiveThemeColor] = useState("blue");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem("theme-color") || "blue";
      setActiveThemeColor(storedColor);
      document.documentElement.setAttribute("data-theme-color", storedColor);
    }
  }, []);

  const handleColorChange = (color) => {
    setActiveThemeColor(color);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-color", color);
      document.documentElement.setAttribute("data-theme-color", color);
    }
  };

  const readURL = (input, setPreviewImage) => {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Logic to save changes if needed, but changes are already saved on change
  };

  return (
    <div className='card h-100 p-0 radius-12'>
      <div className='card-body p-24'>
        <form action='#' onSubmit={handleFormSubmit}>
          <div className='row gy-4'>
            <div className='col-md-6'>
              <label
                htmlFor='imageUpload'
                className='form-label fw-semibold text-secondary-light text-md mb-8'
              >
                Logo{" "}
                <span className='text-secondary-light fw-normal'>
                  (140px X 140px)
                </span>
              </label>
              <input
                type='file'
                className='form-control radius-8'
                id='imageUpload'
                onChange={(e) => readURL(e, setPreviewImage1)}
              />
              <div className='avatar-upload mt-16'>
                <div className='avatar-preview style-two'>
                  <div
                    id='previewImage1'
                    style={{
                      backgroundImage: `url(${previewImage1})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className='col-md-6'>
              <label
                htmlFor='imageUploadTwo'
                className='form-label fw-semibold text-secondary-light text-md mb-8'
              >
                Logo{" "}
                <span className='text-secondary-light fw-normal'>
                  (140px X 140px)
                </span>
              </label>
              <input
                type='file'
                className='form-control radius-8'
                id='imageUploadTwo'
                onChange={(e) => readURL(e, setPreviewImage2)}
              />
              <div className='avatar-upload mt-16'>
                <div className='avatar-preview style-two'>
                  <div
                    id='previewImage2'
                    style={{
                      backgroundImage: `url(${previewImage2})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-32'>
            <h6 className='text-xl mb-16'>Theme Colors</h6>
            <div className='row gy-4'>
              <div className='col-xxl-2 col-md-4 col-sm-6'>
                <input
                  className='form-check-input payment-gateway-input'
                  name='theme-color'
                  type='radio'
                  id='blue'
                  checked={activeThemeColor === 'blue'}
                  onChange={() => handleColorChange('blue')}
                />
                <label
                  htmlFor='blue'
                  className='payment-gateway-label border radius-8 p-8 w-100'
                >
                  <span className='d-flex align-items-center gap-2'>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-primary-600 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Blue
                      </span>
                    </span>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-primary-100 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Focus
                      </span>
                    </span>
                  </span>
                </label>
              </div>
              <div className='col-xxl-2 col-md-4 col-sm-6'>
                <input
                  className='form-check-input payment-gateway-input'
                  name='theme-color'
                  type='radio'
                  id='magenta'
                  checked={activeThemeColor === 'magenta'}
                  onChange={() => handleColorChange('magenta')}
                />
                <label
                  htmlFor='magenta'
                  className='payment-gateway-label border radius-8 p-8 w-100'
                >
                  <span className='d-flex align-items-center gap-2'>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-lilac-600 radius-4' />
                      <span className='text-lilac-light text-md fw-semibold mt-8'>
                        Magenta
                      </span>
                    </span>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-lilac-100 radius-4' />
                      <span className='text-lilac-light text-md fw-semibold mt-8'>
                        Focus
                      </span>
                    </span>
                  </span>
                </label>
              </div>
              <div className='col-xxl-2 col-md-4 col-sm-6'>
                <input
                  className='form-check-input payment-gateway-input'
                  name='theme-color'
                  type='radio'
                  id='orange'
                  checked={activeThemeColor === 'orange'}
                  onChange={() => handleColorChange('orange')}
                />
                <label
                  htmlFor='orange'
                  className='payment-gateway-label border radius-8 p-8 w-100'
                >
                  <span className='d-flex align-items-center gap-2'>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-warning-600 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Orange
                      </span>
                    </span>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-warning-100 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Focus
                      </span>
                    </span>
                  </span>
                </label>
              </div>
              <div className='col-xxl-2 col-md-4 col-sm-6'>
                <input
                  className='form-check-input payment-gateway-input'
                  name='theme-color'
                  type='radio'
                  id='green'
                  checked={activeThemeColor === 'green'}
                  onChange={() => handleColorChange('green')}
                />
                <label
                  htmlFor='green'
                  className='payment-gateway-label border radius-8 p-8 w-100'
                >
                  <span className='d-flex align-items-center gap-2'>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-success-600 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Green
                      </span>
                    </span>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-success-100 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Focus
                      </span>
                    </span>
                  </span>
                </label>
              </div>
              <div className='col-xxl-2 col-md-4 col-sm-6'>
                <input
                  className='form-check-input payment-gateway-input'
                  name='theme-color'
                  type='radio'
                  id='red'
                  checked={activeThemeColor === 'red'}
                  onChange={() => handleColorChange('red')}
                />
                <label
                  htmlFor='red'
                  className='payment-gateway-label border radius-8 p-8 w-100'
                >
                  <span className='d-flex align-items-center gap-2'>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-danger-600 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Red
                      </span>
                    </span>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-danger-100 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Focus
                      </span>
                    </span>
                  </span>
                </label>
              </div>
              <div className='col-xxl-2 col-md-4 col-sm-6'>
                <input
                  className='form-check-input payment-gateway-input'
                  name='theme-color'
                  type='radio'
                  id='blueDark'
                  checked={activeThemeColor === 'blueDark'}
                  onChange={() => handleColorChange('blueDark')}
                />
                <label
                  htmlFor='blueDark'
                  className='payment-gateway-label border radius-8 p-8 w-100'
                >
                  <span className='d-flex align-items-center gap-2'>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-info-600 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Blue Dark
                      </span>
                    </span>
                    <span className='w-50 text-center'>
                      <span className='h-72-px w-100 bg-info-100 radius-4' />
                      <span className='text-secondary-light text-md fw-semibold mt-8'>
                        Focus
                      </span>
                    </span>
                  </span>
                </label>
              </div>
              <div className='d-flex align-items-center justify-content-center gap-3 mt-24'>
                <button
                  type='reset'
                  className='border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8'
                >
                  Reset
                </button>
                <button
                  type='submit'
                  className='btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8'
                >
                  Save Change
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemeLayer;
