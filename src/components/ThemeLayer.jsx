"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

const themeOptions = [
  {
    id: "blue",
    label: "Blue",
    primaryClass: "bg-primary-600",
    focusClass: "bg-primary-100",
    labelClass: "text-secondary-light",
  },
  {
    id: "magenta",
    label: "Magenta",
    primaryClass: "bg-lilac-600",
    focusClass: "bg-lilac-100",
    labelClass: "text-lilac-light",
  },
  {
    id: "orange",
    label: "Orange",
    primaryClass: "bg-warning-600",
    focusClass: "bg-warning-100",
    labelClass: "text-secondary-light",
  },
  {
    id: "green",
    label: "Green",
    primaryClass: "bg-success-600",
    focusClass: "bg-success-100",
    labelClass: "text-secondary-light",
  },
  {
    id: "red",
    label: "Red",
    primaryClass: "bg-danger-600",
    focusClass: "bg-danger-100",
    labelClass: "text-secondary-light",
  },
  {
    id: "blueDark",
    label: "Blue Dark",
    primaryClass: "bg-info-600",
    focusClass: "bg-info-100",
    labelClass: "text-secondary-light",
  },
];
const themeIds = new Set(themeOptions.map((option) => option.id));
const defaultThemeColor = "blue";

const ThemeLayer = () => {
  const [previewImage1, setPreviewImage1] = useState("");
  const [previewImage2, setPreviewImage2] = useState("");
  const [activeThemeColor, setActiveThemeColor] = useState(defaultThemeColor);
  const userHasSelectedTheme = useRef(false);

  const applyThemeToDom = (color) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("theme-color", color);
    document.documentElement.setAttribute("data-theme-color", color);
    document.body?.setAttribute("data-theme-color", color);
  };

  useEffect(() => {
    let isMounted = true;
    const loadTheme = async () => {
      try {
        const storedColor =
          typeof window !== "undefined" ? localStorage.getItem("theme-color") : null;
        const normalizedStoredColor = themeIds.has(storedColor)
          ? storedColor
          : defaultThemeColor;
        let nextColor = normalizedStoredColor || defaultThemeColor;
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("theme_color")
            .eq("id", user.id)
            .maybeSingle();
          const normalizedDbColor = themeIds.has(data?.theme_color)
            ? data.theme_color
            : null;
          if (!error && normalizedDbColor) {
            nextColor = normalizedDbColor;
          } else if (!error && !normalizedDbColor) {
            await supabase
              .from("users")
              .upsert({ id: user.id, theme_color: nextColor }, { onConflict: "id" });
          }
        }
        if (!isMounted || userHasSelectedTheme.current) return;
        setActiveThemeColor(nextColor);
        applyThemeToDom(nextColor);
      } catch (error) {
        if (!isMounted || userHasSelectedTheme.current) return;
        setActiveThemeColor(defaultThemeColor);
        applyThemeToDom(defaultThemeColor);
      }
    };
    loadTheme();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleColorChange = (color) => {
    const normalizedColor = themeIds.has(color) ? color : defaultThemeColor;
    userHasSelectedTheme.current = true;
    setActiveThemeColor(normalizedColor);
    applyThemeToDom(normalizedColor);
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
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const normalizedColor = themeIds.has(activeThemeColor)
      ? activeThemeColor
      : defaultThemeColor;
    userHasSelectedTheme.current = true;
    applyThemeToDom(normalizedColor);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (user) {
      await supabase
        .from("users")
        .upsert({ id: user.id, theme_color: normalizedColor }, { onConflict: "id" });
    }
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
              {themeOptions.map((option) => (
                <div key={option.id} className='col-xxl-2 col-md-4 col-sm-6'>
                  <input
                    className='form-check-input payment-gateway-input'
                    name='theme-color'
                    type='radio'
                    id={option.id}
                    checked={activeThemeColor === option.id}
                    onChange={() => handleColorChange(option.id)}
                  />
                  <label
                    htmlFor={option.id}
                    className='payment-gateway-label border radius-8 p-8 w-100'
                  >
                    <span className='d-flex align-items-center gap-2'>
                      <span className='w-50 text-center'>
                        <span className={`h-72-px w-100 ${option.primaryClass} radius-4`} />
                        <span className={`${option.labelClass} text-md fw-semibold mt-8`}>
                          {option.label}
                        </span>
                      </span>
                      <span className='w-50 text-center'>
                        <span className={`h-72-px w-100 ${option.focusClass} radius-4`} />
                        <span className={`${option.labelClass} text-md fw-semibold mt-8`}>
                          Focus
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
              ))}
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
