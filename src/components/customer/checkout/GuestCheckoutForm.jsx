import React, { useState, useEffect } from "react";

const INFO_KEY = "kterings_customer_info";
const SAVE_KEY = "kterings_customer_save";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const validateAddress = (value) => {
  if (!value.trim()) return "Address is required.";
  return /windsor\s*,?\s*(on|ontario)?/i.test(value)
    ? ""
    : "We currently only deliver within Windsor, Ontario.";
};

// Convert to E.164 internally for Twilio
const normalizeToE164CA = (v) => {
  const digits = v.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return v.trim();
};

const validatePhone = (value) => {
  if (!value.trim()) return "Phone number is required.";
  const normalized = normalizeToE164CA(value);
  return /^\+[1-9]\d{1,14}$/.test(normalized)
    ? ""
    : "Enter a valid phone number, e.g., 519-555-0123 or +1 519-555-0123.";
};

export default function CustomerForm() {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem(INFO_KEY);
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", phone: "", address: "" };
  });

  const [saveInfo, setSaveInfo] = useState(() => {
    const savedFlag = localStorage.getItem(SAVE_KEY);
    return savedFlag ? JSON.parse(savedFlag) : false;
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (saveInfo) {
      localStorage.setItem(SAVE_KEY, "true");
      localStorage.setItem(INFO_KEY, JSON.stringify(customer));
    } else {
      localStorage.setItem(SAVE_KEY, "false");
      localStorage.removeItem(INFO_KEY);
    }
  }, [saveInfo]);

  useEffect(() => {
    if (saveInfo) {
      localStorage.setItem(INFO_KEY, JSON.stringify(customer));
    }
  }, [customer, saveInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear field error
  };

  const validateAll = () => {
    const nextErrors = {};
    if (!customer.name.trim()) nextErrors.name = "Full name is required.";
    if (!isEmail(customer.email)) nextErrors.email = "Enter a valid email.";
    const phoneErr = validatePhone(customer.phone);
    if (phoneErr) nextErrors.phone = phoneErr;
    const addrErr = validateAddress(customer.address);
    if (addrErr) nextErrors.address = addrErr;
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleProceedToPay = (e) => {
    e.preventDefault();
    const nextErrors = validateAll();
    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    // Convert phone for Twilio internally (not shown to user)
    const payload = { ...customer, phone: normalizeToE164CA(customer.phone) };
    console.log("Proceeding with:", payload);

    // call your payment API here with `payload`
  };

  const baseInput =
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none";
  const validCls = "border-gray-300 focus:border-primary";
  const errorCls = "border-red-500 focus:border-red-600";

  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h2>

      <form className="space-y-4" onSubmit={handleProceedToPay}>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`${baseInput} ${errors.name ? errorCls : validCls}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            name="email"
            value={customer.email}
            onChange={handleChange}
            placeholder="johndoe@gmail.com"
            className={`${baseInput} ${errors.email ? errorCls : validCls}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            placeholder="519-555-0123"
            className={`${baseInput} ${errors.phone ? errorCls : validCls}`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
          <textarea
            name="address"
            rows={3}
            value={customer.address}
            onChange={handleChange}
            placeholder="1234 Elm Street, Windsor, ON"
            className={`${baseInput} ${errors.address ? errorCls : validCls} resize-none`}
          />
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
        </div>

        {/* Save Info */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="saveInfo"
            checked={saveInfo}
            onChange={(e) => setSaveInfo(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="saveInfo" className="text-sm text-gray-700 cursor-pointer">
            Save my information for next time
          </label>
        </div>

        {/* Proceed Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-primary text-white"
          >
            Proceed to Pay
          </button>
        </div>
      </form>
    </div>
  );
}
