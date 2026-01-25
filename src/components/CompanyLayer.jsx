"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getActiveOrganizationId } from "@/features/core/services/organization-membership";

const CompanyLayer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Select Country");
  const [city, setCity] = useState("Select City");
  const [stateRegion, setStateRegion] = useState("Select State");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [emergencyReserve, setEmergencyReserve] = useState("");
  const [workingCapital, setWorkingCapital] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [cepLoading, setCepLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeZip = (value) => String(value || "").replace(/\D/g, "").slice(0, 8);

  const parseCurrency = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
  };

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError("");
      const organizationId = await getActiveOrganizationId();
      if (!organizationId) {
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("organizations")
        .select(
          "name,email,phone,country,city,state,zip,address,address_number,emergency_reserve,working_capital"
        )
        .eq("id", organizationId)
        .maybeSingle();
      if (fetchError) {
        setError("Não foi possível carregar as configurações.");
        setLoading(false);
        return;
      }
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setCountry(data.country || "Select Country");
        setCity(data.city || "Select City");
        setStateRegion(data.state || "Select State");
        setZip(data.zip || "");
        setAddress(data.address || "");
        setAddressNumber(data.address_number || "");
        setEmergencyReserve(
          data.emergency_reserve !== null && data.emergency_reserve !== undefined
            ? String(data.emergency_reserve)
            : ""
        );
        setWorkingCapital(
          data.working_capital !== null && data.working_capital !== undefined
            ? String(data.working_capital)
            : ""
        );
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      if (country !== "Brasil") {
        setStateOptions([]);
        return;
      }
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      );
      if (!response.ok) {
        setStateOptions([]);
        return;
      }
      const data = await response.json();
      setStateOptions(
        (data || []).map((item) => ({
          value: item.sigla,
          label: `${item.sigla} - ${item.nome}`,
        }))
      );
    };
    loadStates();
  }, [country]);

  useEffect(() => {
    const loadCities = async () => {
      if (country !== "Brasil" || !stateRegion || stateRegion === "Select State") {
        setCityOptions([]);
        return;
      }
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateRegion}/municipios`
      );
      if (!response.ok) {
        setCityOptions([]);
        return;
      }
      const data = await response.json();
      setCityOptions((data || []).map((item) => item.nome));
    };
    loadCities();
  }, [country, stateRegion]);

  useEffect(() => {
    const fetchCep = async () => {
      if (country !== "Brasil") return;
      const normalized = normalizeZip(zip);
      if (normalized.length !== 8) return;
      setCepLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${normalized}/json/`);
      if (!response.ok) {
        setCepLoading(false);
        return;
      }
      const data = await response.json();
      if (data?.erro) {
        setCepLoading(false);
        return;
      }
      setCountry("Brasil");
      if (data.uf) setStateRegion(data.uf);
      if (data.localidade) setCity(data.localidade);
      if (data.logradouro) {
        const addressValue = data.bairro
          ? `${data.logradouro} - ${data.bairro}`
          : data.logradouro;
        setAddress(addressValue);
      }
      setCepLoading(false);
    };
    fetchCep();
  }, [zip, country]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const organizationId = await getActiveOrganizationId();
    if (!organizationId) {
      setError("Não foi possível identificar a organização.");
      return;
    }
    if (!name || name.trim() === "") {
      setError("O campo 'Full Name' é obrigatório.");
      return;
    }
    if (emergencyReserve === "" || workingCapital === "") {
      setError("Preencha Reserva de emergência e Capital de giro.");
      return;
    }
    setSaving(true);
    const generateSlug = (text) => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    };

    const payload = {
      id: organizationId,
      name,
      slug: generateSlug(name),
      email,
      phone: phone || null,
      country,
      city,
      state: stateRegion,
      zip: zip || null,
      address: address || null,
      address_number: addressNumber || null,
      emergency_reserve: parseCurrency(emergencyReserve),
      working_capital: parseCurrency(workingCapital),
    };
    const { error: saveError } = await supabase.from("organizations").upsert(payload);
    if (saveError) {
      console.error("Erro ao salvar:", saveError);
      setError(`Erro: ${saveError.message || saveError.details || "Erro desconhecido ao salvar"}`);
      setSaving(false);
      return;
    }
    setSuccess("Configurações salvas com sucesso.");
    setSaving(false);
  };

  return (
    <div className='card h-100 p-0 radius-12 overflow-hidden'>
      <div className='card-body p-40'>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            {error ? (
              <div className='col-12'>
                <div className='alert alert-danger'>{error}</div>
              </div>
            ) : null}
            {success ? (
              <div className='col-12'>
                <div className='alert alert-success'>{success}</div>
              </div>
            ) : null}
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='name'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  Full Name <span className='text-danger-600'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control radius-8'
                  id='name'
                  placeholder='Enter Full Name'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='email'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  Email <span className='text-danger-600'>*</span>
                </label>
                <input
                  type='email'
                  className='form-control radius-8'
                  id='email'
                  placeholder='Enter email address'
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
                  Phone Number
                </label>
                <input
                  type='tel'
                  className='form-control radius-8'
                  id='number'
                  placeholder='Enter phone number'
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='Website'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  {" "}
                  Website
                </label>
                <input
                  type='url'
                  className='form-control radius-8'
                  id='Website'
                  placeholder='Website URL'
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='country'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  Country <span className='text-danger-600'>*</span>{" "}
                </label>
                <select
                  className='form-control radius-8 form-select'
                  id='country'
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  <option value='Select Country' disabled>
                    Select Country
                  </option>
                  <option value='Brasil'>Brasil</option>
                  <option value='USA'>USA</option>
                  <option value='Bangladesh'>Bangladesh</option>
                  <option value='Pakistan'>Pakistan</option>
                  <option value='India'>India</option>
                  <option value='Canada'>Canada</option>
                </select>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='state'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  State <span className='text-danger-600'>*</span>{" "}
                </label>
                <select
                  className='form-control radius-8 form-select'
                  id='state'
                  value={stateRegion}
                  onChange={(event) => setStateRegion(event.target.value)}
                >
                  <option value='Select State' disabled>
                    Select State
                  </option>
                  {country === "Brasil"
                    ? stateOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))
                    : (
                        <>
                          <option value='Washington'>Washington</option>
                          <option value='Dhaka'>Dhaka</option>
                          <option value='Lahore'>Lahore</option>
                          <option value='Panjab'>Panjab</option>
                        </>
                      )}
                </select>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='city'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  City <span className='text-danger-600'>*</span>{" "}
                </label>
                <select
                  className='form-control radius-8 form-select'
                  id='city'
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                >
                  <option value='Select City' disabled>
                    Select City
                  </option>
                  {country === "Brasil"
                    ? cityOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))
                    : (
                        <>
                          <option value='Washington'>Washington</option>
                          <option value='Dhaka'>Dhaka</option>
                          <option value='Lahore'>Lahore</option>
                          <option value='Panjab'>Panjab</option>
                        </>
                      )}
                </select>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='zip'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  {" "}
                  Zip Code <span className='text-danger-600'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control radius-8'
                  id='zip'
                  placeholder='Zip Code'
                  value={zip}
                  onChange={(event) => setZip(normalizeZip(event.target.value))}
                />
                {cepLoading ? (
                  <div className='text-xs text-primary-light mt-4'>Buscando CEP...</div>
                ) : null}
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='mb-20'>
                <label
                  htmlFor='address'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  {" "}
                  Address* <span className='text-danger-600'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control radius-8'
                  id='address'
                  placeholder='Enter Your Address'
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='addressNumber'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  Número
                </label>
                <input
                  type='text'
                  className='form-control radius-8'
                  id='addressNumber'
                  placeholder='Nº'
                  value={addressNumber}
                  onChange={(event) => setAddressNumber(event.target.value)}
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='emergencyReserve'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  Reserva de emergência (R$) <span className='text-danger-600'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control radius-8'
                  id='emergencyReserve'
                  placeholder='3.000,00'
                  value={emergencyReserve}
                  onChange={(event) => setEmergencyReserve(event.target.value)}
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='mb-20'>
                <label
                  htmlFor='workingCapital'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  Capital de giro (R$) <span className='text-danger-600'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control radius-8'
                  id='workingCapital'
                  placeholder='500,00'
                  value={workingCapital}
                  onChange={(event) => setWorkingCapital(event.target.value)}
                />
              </div>
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
                disabled={loading || saving}
              >
                {saving ? "Salvando..." : "Save Change"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyLayer;
