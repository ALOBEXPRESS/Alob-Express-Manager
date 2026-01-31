"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import ThemeInit from "../components/helper/ThemeInit";
import NextLink from "next/link";
import { useTranslations } from 'next-intl';

import { supabase, clearAuthStorage } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const MasterLayout = ({ children }) => {
  let pathname = usePathname();
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = usePathname(); 
  const router = useRouter();
  const t = useTranslations('sidebar');
  const tCommon = useTranslations('common');
  const currentLocale = pathname?.split("/")?.[1] || 'pt-br';
  
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (typeof window === "undefined") return;

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location ||
            link.getAttribute("to") === location
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`;
            }
          }
        });
      });
    };

    openActiveDropdown();
  }, [loading, location]);

  if (loading || !user) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearAuthStorage();
    router.push(`/${currentLocale}/sign-in`);
  };

  const withLocale = (href) => {
    if (typeof href !== "string") return href;
    if (href === "#") return href;
    if (!currentLocale || (currentLocale !== "en" && currentLocale !== "pt-br" && currentLocale !== "pt-BR")) return href;
    if (href === "/") return `/${currentLocale}`;
    if (href.startsWith(`/${currentLocale}/`) || href === `/${currentLocale}`) return href;
    if (!href.startsWith("/")) return href;
    return `/${currentLocale}${href}`;
  };

  const Link = ({ href, ...props }) => {
    return <NextLink href={withLocale(href)} {...props} />;
  };

  const handleDropdownClick = (event) => {
    event.preventDefault();
    const clickedLink = event.currentTarget;
    const clickedDropdown = clickedLink.closest(".dropdown");

    if (!clickedDropdown) return;

    const isActive = clickedDropdown.classList.contains("open");

    const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
    allDropdowns.forEach((dropdown) => {
      dropdown.classList.remove("open");
      const submenu = dropdown.querySelector(".sidebar-submenu");
      if (submenu) {
        submenu.style.maxHeight = "0px";
      }
    });

    if (!isActive) {
      clickedDropdown.classList.add("open");
      const submenu = clickedDropdown.querySelector(".sidebar-submenu");
      if (submenu) {
        submenu.style.maxHeight = `${submenu.scrollHeight}px`;
      }
    }
  };

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  const changeLanguage = (lang) => {
    const currentPath = pathname;
    const segments = currentPath.split('/');
    // segments[1] is locale if it exists (e.g. '', 'en', 'dashboard')
    // if start with /en or /pt-br, replace it.
    let newPath = currentPath;
    if (segments[1] === 'en' || segments[1] === 'pt-br') {
        segments[1] = lang;
        newPath = segments.join('/');
    } else {
        newPath = `/${lang}${currentPath}`;
    }
    router.push(newPath);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      <ThemeInit />
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link href='/' className='sidebar-logo'>
            <img
              src='/Logonome-alobexpress 2.png'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='/Logonome-alobexpress 2.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='/assets/images/logo-icon.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area' suppressHydrationWarning={true}>
          <ul className='sidebar-menu' id='sidebar-menu'>
            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <Icon
                  icon='solar:home-smile-angle-outline'
                  className='menu-icon'
                />
                <span>{t('dashboard')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/'
                    className={pathname === "/" || pathname === "/pt-br" || pathname === "/en" || pathname.includes("/calculadora") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                    {t('calculator')}
                  </Link>
                </li>
{/* <li>
                  <Link
                    href='/ai'
                    className={pathname.includes("/ai") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                    {t('ai')}
                  </Link>
                </li> */}
{/* <li>
                  <Link
                    href='/crm'
                    className={pathname.includes("/crm") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('crm')}
                  </Link>
                </li> */}
                <li>
                  <Link
                    href='/e-commerce'
                    className={pathname.includes("/e-commerce") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('ecommerce')}
                  </Link>
                </li>
{/* <li>
                  <Link
                    href='/criptomoeda'
                    className={pathname.includes("/criptomoeda") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />
                    {t('cryptocurrency')}
                  </Link>
                </li> */}
{/* <li>
                  <Link
                    href='/investimento'
                    className={pathname.includes("/investimento") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    {t('investment')}
                  </Link>
                </li> */}
{/* <li>
                  <Link
                    href='/lms'
                    className={pathname.includes("/lms") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    {t('lms')}
                  </Link>
                </li> */}
{/* <li>
                  <Link
                    href='/nft-e-jogos'
                    className={pathname.includes("/nft-e-jogos") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('nft_gaming')}
                  </Link>
                </li> */}
{/* <li>
                  <Link
                    href='/medico'
                    className={pathname.includes("/medico") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('medical')}
                  </Link>
                </li> */}
{/* <li>
                  <Link
                    href='/analytics'
                    className={pathname.includes("/analytics") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('analytics')}
                  </Link>
                </li> */}
                <li>
                  <Link
                    href='/pdv-e-estoque'
                    className={pathname.includes("/pdv-e-estoque") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('pos_inventory')}
                  </Link>
                </li>
{/* <li>
                  <Link
                    href='/financas-e-bancario'
                    className={pathname.includes("/financas-e-bancario") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('finance_banking')}
                  </Link>
                </li> */}
              </ul>
            </li>

            <li className='sidebar-menu-group-title'>{t('application')}</li>
            <li>
              <Link
                href='/email'
                className={pathname.includes("/email") ? "active-page" : ""}
              >
                <Icon icon='mage:email' className='menu-icon' />
                <span>{t('email')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/chat-message'
                className={pathname.includes("/chat-message") ? "active-page" : ""}
              >
                <Icon icon='bi:chat-dots' className='menu-icon' />
                <span>{t('chat')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/calendar-main'
                className={pathname.includes("/calendar-main") ? "active-page" : ""}
              >
                <Icon icon='solar:calendar-outline' className='menu-icon' />
                <span>{t('calendar')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/kanban'
                className={pathname.includes("/kanban") ? "active-page" : ""}
              >
                <Icon
                  icon='material-symbols:map-outline'
                  className='menu-icon'
                />
                <span>{t('kanban')}</span>
              </Link>
            </li>

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <Icon icon='hugeicons:invoice-03' className='menu-icon' />
                <span>{t('invoice')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/invoice-list'
                    className={pathname.includes("/invoice-list") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('list')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/invoice-preview'
                    className={pathname.includes("/invoice-preview") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    {t('preview')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/invoice-add'
                    className={pathname.includes("/invoice-add") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('add_new')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/invoice-edit'
                    className={pathname.includes("/invoice-edit") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    {t('edit')}
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li className='dropdown'>
              <a href='javascript:void(0)' onClick={handleDropdownClick}>
                <i className='ri-robot-2-line mr-10' />
                <span>{t('ai_application')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/text-generator'
                    className={pathname.includes("/text-generator") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('text_generator')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/code-generator'
                    className={pathname.includes("/code-generator") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('code_generator')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/image-generator'
                    className={pathname.includes("/image-generator") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('image_generator')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/voice-generator'
                    className={pathname.includes("/voice-generator") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    {t('voice_generator')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/video-generator'
                    className={pathname.includes("/video-generator") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    {t('video_generator')}
                  </Link>
                </li>
              </ul>
            </li> */}

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <i className='ri-robot-2-line mr-10' />
                <span>{t('crypto_currency')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/wallet'
                    className={pathname.includes("/wallet") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('wallet')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/marketplace'
                    className={pathname.includes("/marketplace") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    {t('marketplace')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/marketplace-details'
                    className={pathname.includes("/marketplace-details") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    {t('marketplace_details')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/portfolio'
                    className={pathname.includes("/portfolio") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    {t('portfolios')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className='sidebar-menu-group-title'>{t('ui_elements')}</li>

            <li className='dropdown'>
              <a href='#' onClick={handleDropdownClick}>
                <Icon
                  icon='solar:document-text-outline'
                  className='menu-icon'
                />
                <span>{t('components')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/typography'
                    className={pathname.includes("/typography") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                    {t('typography')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/colors'
                    className={pathname.includes("/colors") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('colors')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/button'
                    className={pathname.includes("/button") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    {t('button')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/dropdown'
                    className={pathname.includes("/dropdown") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-lilac-600 w-auto' />{" "}
                    {t('dropdown')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/alert'
                    className={pathname.includes("/alert") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('alerts')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/card'
                    className={pathname.includes("/card") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    {t('card')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/carousel'
                    className={pathname.includes("/carousel") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('carousel')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/avatar'
                    className={pathname.includes("/avatar") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    {t('avatars')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/progress'
                    className={pathname.includes("/progress") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('progress_bar')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/tabs'
                    className={pathname.includes("/tabs") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('tab_accordion')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/pagination'
                    className={pathname.includes("/pagination") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />
                    {t('pagination')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/badges'
                    className={pathname.includes("/badges") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('badges')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/tooltip'
                    className={pathname.includes("/tooltip") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-lilac-600 w-auto' />{" "}
                    {t('tooltip_popover')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/videos'
                    className={pathname.includes("/videos") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-cyan w-auto' />{" "}
                    {t('videos')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/star-rating'
                    className={pathname.includes("/star-rating") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-indigo w-auto' />{" "}
                    {t('star_ratings')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/tags'
                    className={pathname.includes("/tags") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    {t('tags')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/list'
                    className={pathname.includes("/list") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-red w-auto' />{" "}
                    {t('list')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/calendar'
                    className={pathname.includes("/calendar") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-yellow w-auto' />{" "}
                    {t('calendar')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/radio'
                    className={pathname.includes("/radio") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-orange w-auto' />{" "}
                    {t('radio')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/switch'
                    className={pathname.includes("/switch") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-pink w-auto' />{" "}
                    {t('switch')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/image-upload'
                    className={pathname.includes("/image-upload") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('image_upload')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className='dropdown'>
              <a href='#' onClick={handleDropdownClick}>
                <Icon icon='heroicons:document' className='menu-icon' />
                <span>{t('forms')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/form'
                    className={pathname.includes("/form") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('input_forms')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/form-layout'
                    className={pathname.includes("/form-layout") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('input_layout')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/form-validation'
                    className={pathname.includes("/form-validation") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    {t('form_validation')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/wizard'
                    className={pathname.includes("/wizard") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    {t('form_wizard')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <Icon icon='mingcute:storage-line' className='menu-icon' />
                <span>{t('table')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/table-basic'
                    className={pathname.includes("/table-basic") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('basic_table')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/table-data'
                    className={pathname.includes("/table-data") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('data_table')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className='dropdown'>
              <a href='#' onClick={handleDropdownClick}>
                <Icon icon='solar:pie-chart-outline' className='menu-icon' />
                <span>{t('chart')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/line-chart'
                    className={pathname.includes("/line-chart") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    {t('line_chart')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/column-chart'
                    className={pathname.includes("/column-chart") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('column_chart')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/pie-chart'
                    className={pathname.includes("/pie-chart") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    {t('pie_chart')}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href='/widgets'
                className={pathname.includes("/widgets") ? "active-page" : ""}
              >
                <Icon icon='fe:vector' className='menu-icon' />
                <span>{t('widgets')}</span>
              </Link>
            </li>

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>{t('users')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/users-list'
                    className={pathname.includes("/users-list") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('users_list')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/users-grid'
                    className={pathname.includes("/users-grid") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('users_grid')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/add-user'
                    className={pathname.includes("/add-user") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('add_user')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/view-profile'
                    className={pathname.includes("/view-profile") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    {t('view_profile')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <i className='ri-user-settings-line' />
                <span>{t('role_access')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/role-access'
                    className={pathname.includes("/role-access") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('role_access')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/assign-role'
                    className={pathname.includes("/assign-role") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('assign_role')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className='sidebar-menu-group-title'>{t('application')}</li>

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <Icon icon='simple-line-icons:vector' className='menu-icon' />
                <span>{t('authentication')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/sign-in'
                    className={pathname.includes("/sign-in") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('sign_in')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/sign-up'
                    className={pathname.includes("/sign-up") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('sign_up')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/forgot-password'
                    className={pathname.includes("/forgot-password") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('forgot_password')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>{t('gallery')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/gallery-grid'
                    className={pathname.includes("/gallery-grid") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('gallery_grid')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/gallery'
                    className={pathname.includes("/gallery") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('gallery_grid_desc')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/gallery-masonry'
                    className={pathname.includes("/gallery-masonry") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('gallery_grid')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/gallery-hover'
                    className={pathname.includes("/gallery-hover") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    {t('gallery_hover_effect')}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                href='/pricing'
                className={pathname.includes("/pricing") ? "active-page" : ""}
              >
                <Icon
                  icon='hugeicons:money-send-square'
                  className='menu-icon'
                />
                <span>{t('pricing')}</span>
              </Link>
            </li>

            <li className='dropdown'>
              <a href='#' onClick={handleDropdownClick}>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>{t('blog')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/blog'
                    className={pathname.includes("/blog") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    {t('blog')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog-details'
                    className={pathname.includes("/blog-details") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    {t('blog_details')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/add-blog'
                    className={pathname.includes("/add-blog") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    {t('add_blog')}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href='/testimonials'
                className={pathname.includes("/testimonials") ? "active-page" : ""}
              >
                <Icon icon='ri-star-line' className='menu-icon' />
                <span>{t('testimonials')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/faq'
                className={pathname.includes("/faq") ? "active-page" : ""}
              >
                <Icon
                  icon='mage:message-question-mark-round'
                  className='menu-icon'
                />
                <span>{t('faq')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/error'
                className={pathname.includes("/error") ? "active-page" : ""}
              >
                <Icon icon='streamline:straight-face' className='menu-icon' />
                <span>404</span>
              </Link>
            </li>
            <li>
              <Link
                href='/terms-condition'
                className={pathname.includes("/terms-condition") ? "active-page" : ""}
              >
                <Icon icon='octicon:info-24' className='menu-icon' />
                <span>Terms &amp; Conditions</span>
              </Link>
            </li>
            <li>
              <Link
                href='/coming-soon'
                className={pathname.includes("/coming-soon") ? "active-page" : ""}
              >
                <i className='ri-rocket-line menu-icon'></i>
                <span>{t('coming_soon')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/access-denied'
                className={pathname.includes("/access-denied") ? "active-page" : ""}
              >
                <i className='ri-folder-lock-line menu-icon'></i>
                <span>{t('access_denied')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/maintenance'
                className={pathname.includes("/maintenance") ? "active-page" : ""}
              >
                <i className='ri-hammer-line menu-icon'></i>
                <span>{t('maintenance')}</span>
              </Link>
            </li>
            <li>
              <Link
                href='/blank-page'
                className={pathname.includes("/blank-page") ? "active-page" : ""}
              >
                <i className='ri-checkbox-multiple-blank-line menu-icon'></i>
                <span>{t('blank_page')}</span>
              </Link>
            </li>

            <li className='dropdown'>
              <a onClick={handleDropdownClick} style={{ cursor: 'pointer' }}>
                <Icon
                  icon='icon-park-outline:setting-two'
                  className='menu-icon'
                />
                <span>{tCommon('settings')}</span>
              </a>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/company'
                    className={pathname.includes("/company") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Company
                  </Link>
                </li>
                <li>
                  <Link
                    href='/notification'
                    className={
                      pathname.includes("/notification") ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    API's
                  </Link>
                </li>
                <li>
                  <Link
                    href='/alerta-notificacao'
                    className={
                      pathname.includes("/alerta-notificacao") ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Notificação
                  </Link>
                </li>
                <li>
                  <Link
                    href='/theme'
                    className={pathname.includes("/theme") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Theme
                  </Link>
                </li>
                <li>
                  <Link
                    href='/currencies'
                    className={pathname.includes("/currencies") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Currencies
                  </Link>
                </li>
                <li>
                  <Link
                    href='/language'
                    className={pathname.includes("/language") ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Languages
                  </Link>
                </li>
                <li>
                  <Link
                    href='/payment-gateway'
                    className={
                      pathname.includes("/payment-gateway") ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Payment Gateway
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header' suppressHydrationWarning={true}>
          <div className='row align-items-center justify-content-between' suppressHydrationWarning={true}>
            <div className='col-auto' suppressHydrationWarning={true}>
              <div className='d-flex flex-wrap align-items-center gap-4' suppressHydrationWarning={true}>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                <form className='navbar-search'>
                  <input type='text' name='search' placeholder={tCommon('search')} />
                  <Icon icon='ion:search-outline' className='icon' />
                </form>
              </div>
            </div>
            <div className='col-auto' suppressHydrationWarning={true}>
              <div className='d-flex flex-wrap align-items-center gap-3' suppressHydrationWarning={true}>
                <ThemeToggleButton />
                <div className='dropdown d-none d-sm-inline-block' suppressHydrationWarning={true}>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src={pathname.startsWith('/pt-br') || (!pathname.startsWith('/en')) ? '/assets/images/flags/flag1.png' : '/assets/images/flags/flag8.png'}
                      alt='Language'
                      className='w-24 h-24 object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          {t('choose_language')}
                        </h6>
                      </div>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-8'>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16' onClick={() => changeLanguage('pt-br')}>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='portuguese'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag1.png'
                              alt='Brazil'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Português
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='language'
                          id='portuguese'
                          checked={pathname.startsWith('/pt-br') || (!pathname.startsWith('/en'))}
                          readOnly
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16' onClick={() => changeLanguage('en')} suppressHydrationWarning={true}>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='english'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='/assets/images/flags/flag8.png'
                              alt='English'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              English
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='language'
                          id='english'
                          checked={pathname.startsWith('/en')}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className='dropdown' suppressHydrationWarning={true}>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <Icon
                      icon='mage:email'
                      className='text-primary-light text-xl'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                    <div className='m-16 p-12 radius-8 bg-primary-50 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Message
                        </h6>
                      </div>
                      <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                        05
                      </span>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='/assets/images/notification/profile-3.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            8
                          </span>
                        </div>
                      </a>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='/assets/images/notification/profile-4.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-warning-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            2
                          </span>
                        </div>
                      </a>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='/assets/images/notification/profile-5.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-danger-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            2
                          </span>
                        </div>
                      </a>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='/assets/images/notification/profile-6.png'
                              alt=''
                            />
                            <span className='w-8-px h-8-px bg-neutral-300 rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            2
                          </span>
                        </div>
                      </a>
                    </div>
                    <div className='text-center py-12 px-16'>
                      <a
                        href='#'
                        className='text-primary-600 fw-semibold text-md hover-text-primary d-flex align-items-center justify-content-center gap-2'
                      >
                        <span>See All Messages</span>
                        <Icon
                          icon='iconamoon:arrow-right-2'
                          className='icon text-xl'
                        />
                      </a>
                    </div>
                  </div>
                </div>

                <div className='dropdown'>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <Icon
                      icon='iconoir:bell'
                      className='text-primary-light text-xl'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                    <div className='m-16 p-12 radius-8 bg-primary-50 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Notifications
                        </h6>
                      </div>
                      <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                        05
                      </span>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <Icon
                              icon='bitcoin-icons:verify-outline'
                              className='icon text-xxl'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Congratulations
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </a>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-warning-subtle text-warning-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <Icon
                              icon='bitcoin-icons:verify-outline'
                              className='icon text-xxl'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Alerts
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </a>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-danger-subtle text-danger-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <Icon
                              icon='bitcoin-icons:verify-outline'
                              className='icon text-xxl'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Unverified
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </a>
                      <a
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-neutral-200 text-neutral-600 rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <Icon
                              icon='bitcoin-icons:verify-outline'
                              className='icon text-xxl'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Verified
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </a>
                    </div>
                    <div className='text-center py-12 px-16'>
                      <a
                        href='#'
                        className='text-primary-600 fw-semibold text-md hover-text-primary d-flex align-items-center justify-content-center gap-2'
                      >
                        <span>See All Notifications</span>
                        <Icon
                          icon='iconamoon:arrow-right-2'
                          className='icon text-xl'
                        />
                      </a>
                    </div>
                  </div>
                </div>

                <div className='dropdown' suppressHydrationWarning={true}>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src='/assets/images/user-list/user-list1.png'
                      alt='image'
                      className='w-40-px h-40-px object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          {user?.user_metadata?.full_name || user?.email || 'User'}
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          Admin
                        </span>
                      </div>
                      <button type='button' className='close-dropdown'>
                        <Icon icon='radix-icons:cross-1' className='icon text-xl' />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          href='/view-profile'
                        >
                          <Icon
                            icon='solar:user-linear'
                            className='icon text-xl'
                          />
                          {tCommon('my_profile')}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          href='/email'
                        >
                          <Icon
                            icon='tabler:message-check'
                            className='icon text-xl'
                          />
                          Inbox
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          href='/company'
                        >
                          <Icon
                            icon='icon-park-outline:setting-two'
                            className='icon text-xl'
                          />
                          {tCommon('settings')}
                        </Link>
                      </li>
                      <li>
                        <button
                          type='button'
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                          onClick={handleLogout}
                        >
                          <Icon icon='lucide:power' className='icon text-xl' />{" "}
                          {tCommon('logout')}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
        {/* Footer */}
        <footer className='d-footer'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <p className='mb-0'>© 2024 WowDash. All Rights Reserved.</p>
            </div>
            <div className='col-auto'>
              <p className='mb-0'>
                Made by <span className='text-primary-600'>wowtheme7</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
