// src/components/admin/ChefForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createChef, updateChef } from "../../api/chef";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ChefForm({ initialData = null, isEdit = false }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    bio: "",
    ethnicity: "",
    experienceUnit: "",
    experienceValue: 0,
    streetAddress: "",
    city: "",
    phone: "",
    apartment: "",
    province: "",
    country: "",
    postalCode: "",
    isVerified: false,
    isActive: true,
  });
// top of component
  const E164 = /^\+[1-9]\d{1,14}$/;
  const [phoneError, setPhoneError] = useState(""); 
  const [specialties, setSpecialties] = useState([""]); // Dynamic specialties array
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modal, setModal] = useState({ success: false, error: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Populate form and specialties when editing
  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        name: initialData.name || "",
        username: initialData.username || "",
        password: "", // Password should not be pre-filled for security
        bio: initialData.bio || "",
        ethnicity: initialData.ethnicity || "",
        experienceUnit: initialData.experienceUnit || "",
        experienceValue: initialData.experienceValue || "",
        streetAddress: initialData.streetAddress || "",
        city: initialData.city || "",
        apartment: initialData.apartment || "",
        province: initialData.province || "",
        country: initialData.country || "",
        phone: initialData.phone || "",
        postalCode: initialData.postalCode || "",
        isVerified: initialData.isVerified || false,
        isActive: initialData.isActive ?? true,
      });
      setPreview(initialData.photoUrl || null);
      setSpecialties(initialData.specialties?.length ? initialData.specialties : [""]);
    }
  }, [isEdit, initialData]);

  // Handle text & checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle specialties
  const handleSpecialtyChange = (index, value) => {
    const updated = [...specialties];
    updated[index] = value;
    setSpecialties(updated);
  };

  const addSpecialtyField = () => {
    setSpecialties([...specialties, ""]);
  };

  const removeSpecialty = (index) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    formData.append("specialties", JSON.stringify(specialties.filter((s) => s.trim() !== "")));

    if (image) formData.append("photo", image);

    try {
      if (isEdit) {
        await updateChef(initialData._id, formData);
      } else {
        await createChef(formData);
      }
      setModal({ success: true, error: "" });
      setTimeout(() => navigate("/supervised/chefs"), 2000);
    } catch (err) {
      setModal({ success: false, error: err.message });
    }
  };

  return (
    <AdminLayout>
        <div className="w-full max-w-4xl bg-white mx-auto p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary text-center mb-6">
            {isEdit ? "Edit Kterer" : "Add New Kterer"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="font-semibold block mb-1">Name *</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Username */}
            <div>
              <label className="font-semibold block mb-1">Username *</label>
              <input
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-semibold block mb-1">
                Password {isEdit && <span className="text-sm text-gray-500">(Leave blank to keep current)</span>}
              </label>
             <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder={isEdit ? "••••••••" : ""}
              {...(!isEdit && { required: true })}
            />
            <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password<small className="text-sm text-gray-500">Only if you have changed the password</small>
            </label>
            
            </div>
            {/* Bio */}
            <div>
              <label className="font-semibold block mb-1">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Ethnicity */}
            <div>
              <label className="font-semibold block mb-1">Ethnicity</label>
              <input
                name="ethnicity"
                value={form.ethnicity}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Phone number */}
            <div>
              <label className="font-semibold block mb-1">
              Phone *<span className="text-sm text-gray-500"></span>
              </label>
              <input
                name="phone"
                required
                inputMode="tel"
                placeholder="+14165551234"
                value={form.phone}
                onChange={(e) => {
                // allow only "+" and digits
                const raw = e.target.value.replace(/[^\d+]/g, "");
                setForm(f => ({ ...f, phone: raw }));

                // live validation (optional: only when something typed)
                if (raw && !E164.test(raw)) {
                  setPhoneError("Use E.164 format, e.g. +14165551234");
            } else {
              setPhoneError("");
            }
            }}
            onBlur={() => {
            if (form.phone && !E164.test(form.phone)) {
            setPhoneError("Use E.164 format, e.g. +14165551234");
            }
            }}
            className={`w-full border rounded px-3 py-2 ${phoneError ? "border-red-500" : ""}`}
            />
            {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
          </div>

            {/* Specialties */}
            <div>
              <label className="font-semibold block mb-1">Specialties</label>
              {specialties.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center mt-2">
                  <input
                    value={spec}
                    onChange={(e) => handleSpecialtyChange(idx, e.target.value)}
                    placeholder={`Specialty #${idx + 1} (e.g. Italian, Vegan)`}
                    className="w-full border rounded px-3 py-2"
                  />
                  {specialties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecialty(idx)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecialtyField}
                className="bg-primary text-white px-4 py-2 rounded-full mt-2"
              >
                + Add Another Specialty
              </button>
            </div>

            {/* Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Experience Value</label>
                <input
                  name="experienceValue"
                  placeholder="e.g. 5"
                  value={form.experienceValue}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Experience Unit</label>
                <input
                  name="experienceUnit"
                  placeholder="e.g. years"
                  value={form.experienceUnit}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="font-semibold block mb-1">Street Address</label>
              <input
                name="streetAddress"
                value={form.streetAddress}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Province</label>
                <input
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Postal Code</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="font-semibold block mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" className="h-40 rounded" />
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="flex gap-6 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={form.isVerified}
                  onChange={handleChange}
                  className="mr-2"
                />
                Verified
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                Active
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white text-lg font-bold w-full mt-6 py-3 rounded-full"
            >
              {isEdit ? "Update Kterer" : "Add Kterer"}
            </button>
          </form>

          {/* Success Modal */}
          {modal.success && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 font-nunito">
              <div className="bg-white border border-primary/20 rounded-2xl shadow-xl max-w-md w-full px-6 py-8 text-center animate-fade-in">
                <h2 className="text-xl font-bold text-primary mb-2">
                  {isEdit ? "Kterer Updated Successfully!" : "Kterer Added Successfully!"}
                </h2>
                <button
                  onClick={() => setModal({ success: false, error: "" })}
                  className="mt-6 inline-block bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-semibold transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Error Modal */}
          {modal.error && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 font-nunito">
              <div className="bg-white border border-red-300 rounded-2xl shadow-xl max-w-md w-full px-6 py-8 text-center animate-fade-in">
                <h2 className="text-xl font-bold text-red-600 mb-2">Something Went Wrong</h2>
                <p className="text-gray-600">{modal.error}</p>
                <button
                  onClick={() => setModal({ success: false, error: "" })}
                  className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
    </AdminLayout>
  );
}
