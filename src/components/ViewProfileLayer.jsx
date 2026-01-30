"use client";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { supabase, getSafeUser } from "@/lib/supabase/client";

const ViewProfileLayer = () => {
  const t = useTranslations('profile');
  const defaultProfileImage = "/assets/images/user-grid/user-grid-img13.png";
  const [imagePreview, setImagePreview] = useState(
    defaultProfileImage
  );
  const [profileImage, setProfileImage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [designSpecialties, setDesignSpecialties] = useState([]);
  const [language, setLanguage] = useState("");
  const [bio, setBio] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggle function for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result?.toString() || "";
        setImagePreview(result || defaultProfileImage);
        setProfileImage(result);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };

  const departmentOptions = ["Venda", "Design", "Marketing", "Jurídico"];
  const designOptions = ["Social media", "Websites", "Logo"];

  const handleToggleDesignSpecialty = (value) => {
    setDesignSpecialties((previous) => {
      if (previous.includes(value)) {
        return previous.filter((item) => item !== value);
      }
      return [...previous, value];
    });
  };

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    setError("");
    const { user } = await getSafeUser();
    if (!user) {
      setLoadingProfile(false);
      return;
    }
    const metadata = user.user_metadata || {};
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("full_name,email,phone,avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    if (fetchError) {
      setError(fetchError.message || t('save_error'));
      setLoadingProfile(false);
      return;
    }
    setFullName(data?.full_name || "");
    setEmail(data?.email || user.email || "");
    setPhone(data?.phone || "");
    setDepartment(metadata.department || "");
    const storedDesignation = Array.isArray(metadata.designation)
      ? metadata.designation
      : metadata.designation
        ? [metadata.designation]
        : [];
    setDesignSpecialties(storedDesignation);
    setDesignation(storedDesignation[0] || "");
    setLanguage(metadata.languages || "");
    setBio(metadata.bio || "");
    const storedAvatar = data?.avatar_url || "";
    setProfileImage(storedAvatar);
    setImagePreview(storedAvatar || defaultProfileImage);
    setLoadingProfile(false);
  }, [defaultProfileImage, t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const { user } = await getSafeUser();
    if (!user) {
      setError(t('user_not_found'));
      setSaving(false);
      return;
    }
    const designationValues =
      department === "Design"
        ? designSpecialties
        : designation
          ? [designation]
          : [];
    const payload = {
      id: user.id,
      full_name: fullName || null,
      email: email || null,
      phone: phone || null,
      avatar_url: profileImage || null,
    };
    const { error: saveError } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "id" });
    if (saveError) {
      setError(saveError.message || t('save_error'));
      setSaving(false);
      return;
    }
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        department: department || null,
        designation: designationValues.length ? designationValues : null,
        languages: language || null,
        bio: bio || null,
      },
    });
    if (metadataError) {
      setError(metadataError.message || t('save_error'));
      setSaving(false);
      return;
    }
    setSuccess(t('save_success'));
    setSaving(false);
  };

  const handleCancel = async () => {
    setSuccess("");
    await loadProfile();
  };
  const displayName = fullName || "—";
  const displayEmail = email || "—";
  const displayPhone = phone || "—";
  const displayDepartment = department || "—";
  const displayDesignation =
    department === "Design"
      ? designSpecialties.length
        ? designSpecialties.join(", ")
        : "—"
      : designation || "—";
  const displayLanguage = language || "—";
  const displayBio = bio || "—";
  return (
    <div className='row gy-4'>
      <div className='col-lg-4'>
        <div className='user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100'>
          <img
            src='/assets/images/user-grid/user-grid-bg1.png'
            alt=''
            className='w-100 object-fit-cover'
          />
          <div className='pb-24 ms-16 mb-24 me-16  mt--100'>
            <div className='text-center border border-top-0 border-start-0 border-end-0'>
              <img
                src={imagePreview || defaultProfileImage}
                alt=''
                className='border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover'
              />
              <h6 className='mb-0 mt-16'>{displayName}</h6>
              <span className='text-secondary-light mb-16'>
                {displayEmail}
              </span>
            </div>
            <div className='mt-24'>
              <h6 className='text-xl mb-16'>{t('personal_info')}</h6>
              <ul>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {t('full_name')}
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {displayName}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    {t('email')}
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {displayEmail}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    {t('phone_number')}
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {displayPhone}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    {t('department')}
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {displayDepartment}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    {t('designation')}
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {displayDesignation}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    {t('languages')}
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {displayLanguage}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    {t('bio')}
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {displayBio}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='col-lg-8'>
        <div className='card h-100'>
          <div className='card-body p-24'>
            <ul
              className='nav border-gradient-tab nav-pills mb-20 d-inline-flex'
              id='pills-tab'
              role='tablist'
            >
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center px-24 active'
                  id='pills-edit-profile-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-edit-profile'
                  type='button'
                  role='tab'
                  aria-controls='pills-edit-profile'
                  aria-selected='true'
                >
                  {t('edit_profile')}
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center px-24'
                  id='pills-change-passwork-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-change-passwork'
                  type='button'
                  role='tab'
                  aria-controls='pills-change-passwork'
                  aria-selected='false'
                  tabIndex={-1}
                >
                  {t('change_password')}
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center px-24'
                  id='pills-notification-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-notification'
                  type='button'
                  role='tab'
                  aria-controls='pills-notification'
                  aria-selected='false'
                  tabIndex={-1}
                >
                  {t('notification_settings')}
                </button>
              </li>
            </ul>
            <div className='tab-content' id='pills-tabContent'>
              <div
                className='tab-pane fade show active'
                id='pills-edit-profile'
                role='tabpanel'
                aria-labelledby='pills-edit-profile-tab'
                tabIndex={0}
              >
                <h6 className='text-md text-primary-light mb-16'>
                  {t('profile_image')}
                </h6>
                {/* Upload Image Start */}
                <div className='mb-24 mt-16'>
                  <div className='avatar-upload'>
                    <div className='avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer'>
                      <input
                        type='file'
                        id='imageUpload'
                        accept='.png, .jpg, .jpeg'
                        hidden
                        onChange={readURL}
                      />
                      <label
                        htmlFor='imageUpload'
                        className='w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle'
                      >
                        <Icon
                          icon='solar:camera-outline'
                          className='icon'
                        ></Icon>
                      </label>
                    </div>
                    <div className='avatar-preview'>
                      <div
                        id='imagePreview'
                        style={{
                          backgroundImage: `url(${imagePreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Upload Image End */}
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='name'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          {t('full_name')}
                          <span className='text-danger-600'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control radius-8'
                          id='name'
                          placeholder={t('full_name_placeholder')}
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='email'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          {t('email')} <span className='text-danger-600'>*</span>
                        </label>
                        <input
                          type='email'
                          className='form-control radius-8'
                          id='email'
                          placeholder={t('email_placeholder')}
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='number'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          {t('phone_number')}
                        </label>
                        <input
                          type='tel'
                          className='form-control radius-8'
                          id='number'
                          placeholder={t('phone_placeholder')}
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='depart'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          {t('department')}
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='depart'
                          value={department}
                          onChange={(event) => {
                            setDepartment(event.target.value);
                            setDesignation("");
                            setDesignSpecialties([]);
                          }}
                        >
                          <option value='' disabled>
                            {t('department_placeholder')}
                          </option>
                          {departmentOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='desig'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          {t('designation')}
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        {department === "Design" ? (
                          <div className='d-flex flex-column gap-2'>
                            {designOptions.map((option) => (
                              <label
                                key={option}
                                className='d-flex align-items-center gap-2 text-secondary-light'
                                htmlFor={`design-${option}`}
                              >
                                <input
                                  id={`design-${option}`}
                                  type='checkbox'
                                  className='form-check-input'
                                  checked={designSpecialties.includes(option)}
                                  onChange={() => handleToggleDesignSpecialty(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type='text'
                            className='form-control radius-8'
                            id='desig'
                            placeholder={t('designation_placeholder')}
                            value={designation}
                            onChange={(event) => setDesignation(event.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='Language'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          {t('languages')}
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='Language'
                          value={language}
                          onChange={(event) => setLanguage(event.target.value)}
                        >
                          <option value='' disabled>
                            {t('language_placeholder')}
                          </option>
                          <option value='Inglês'>{t('language_english')}</option>
                          <option value='Bengali'>{t('language_bengali')}</option>
                          <option value='Hindi'>{t('language_hindi')}</option>
                          <option value='Árabe'>{t('language_arabic')}</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-12'>
                      <div className='mb-20'>
                        <label
                          htmlFor='desc'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          {t('bio')}
                        </label>
                        <textarea
                          name='#0'
                          className='form-control radius-8'
                          id='desc'
                          placeholder={t('bio_placeholder')}
                          value={bio}
                          onChange={(event) => setBio(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex align-items-center justify-content-center gap-3'>
                    <button
                      type='button'
                      className='border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8'
                      onClick={handleCancel}
                      disabled={loadingProfile || saving}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8'
                      disabled={loadingProfile || saving}
                    >
                      {saving ? t('saving') : t('save')}
                    </button>
                  </div>
                  {success ? (
                    <div className='shadcn-alert-success mt-16'>{success}</div>
                  ) : null}
                  {error ? (
                    <div className='shadcn-alert-error mt-16'>{error}</div>
                  ) : null}
                </form>
              </div>
              <div
                className='tab-pane fade'
                id='pills-change-passwork'
                role='tabpanel'
                aria-labelledby='pills-change-passwork-tab'
                tabIndex='0'
              >
                <div className='mb-20'>
                  <label
                    htmlFor='your-password'
                    className='form-label fw-semibold text-primary-light text-sm mb-8'
                  >
                    {t('new_password')} <span className='text-danger-600'>*</span>
                  </label>
                  <div className='position-relative'>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className='form-control radius-8'
                      id='your-password'
                      placeholder={t('new_password_placeholder')}
                    />
                    <span
                      className={`toggle-password ${
                        passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>

                <div className='mb-20'>
                  <label
                    htmlFor='confirm-password'
                    className='form-label fw-semibold text-primary-light text-sm mb-8'
                  >
                    {t('confirm_password')} <span className='text-danger-600'>*</span>
                  </label>
                  <div className='position-relative'>
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className='form-control radius-8'
                      id='confirm-password'
                      placeholder={t('confirm_password_placeholder')}
                    />
                    <span
                      className={`toggle-password ${
                        confirmPasswordVisible
                          ? "ri-eye-off-line"
                          : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={toggleConfirmPasswordVisibility}
                    ></span>
                  </div>
                </div>
              </div>
              <div
                className='tab-pane fade'
                id='pills-notification'
                role='tabpanel'
                aria-labelledby='pills-notification-tab'
                tabIndex={0}
              >
                <div className='form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16'>
                  <label
                    htmlFor='companzNew'
                    className='position-absolute w-100 h-100 start-0 top-0'
                  />
                  <div className='d-flex align-items-center gap-3 justify-content-between'>
                    <span className='form-check-label line-height-1 fw-medium text-secondary-light'>
                      {t('company_news')}
                    </span>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      role='switch'
                      id='companzNew'
                    />
                  </div>
                </div>
                <div className='form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16'>
                  <label
                    htmlFor='pushNotifcation'
                    className='position-absolute w-100 h-100 start-0 top-0'
                  />
                  <div className='d-flex align-items-center gap-3 justify-content-between'>
                    <span className='form-check-label line-height-1 fw-medium text-secondary-light'>
                      {t('push_notification')}
                    </span>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      role='switch'
                      id='pushNotifcation'
                      defaultChecked=''
                    />
                  </div>
                </div>
                <div className='form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16'>
                  <label
                    htmlFor='weeklyLetters'
                    className='position-absolute w-100 h-100 start-0 top-0'
                  />
                  <div className='d-flex align-items-center gap-3 justify-content-between'>
                    <span className='form-check-label line-height-1 fw-medium text-secondary-light'>
                      {t('weekly_newsletters')}
                    </span>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      role='switch'
                      id='weeklyLetters'
                      defaultChecked=''
                    />
                  </div>
                </div>
                <div className='form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16'>
                  <label
                    htmlFor='meetUp'
                    className='position-absolute w-100 h-100 start-0 top-0'
                  />
                  <div className='d-flex align-items-center gap-3 justify-content-between'>
                    <span className='form-check-label line-height-1 fw-medium text-secondary-light'>
                      {t('meetups_near_you')}
                    </span>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      role='switch'
                      id='meetUp'
                    />
                  </div>
                </div>
                <div className='form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16'>
                  <label
                    htmlFor='orderNotification'
                    className='position-absolute w-100 h-100 start-0 top-0'
                  />
                  <div className='d-flex align-items-center gap-3 justify-content-between'>
                    <span className='form-check-label line-height-1 fw-medium text-secondary-light'>
                      {t('order_notifications')}
                    </span>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      role='switch'
                      id='orderNotification'
                      defaultChecked=''
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileLayer;
