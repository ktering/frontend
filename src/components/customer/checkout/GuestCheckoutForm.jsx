import React, { useState, useEffect } from "react";

export default function CustomerForm() {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
   const [saveInfo, setSaveInfo] = useState(false);
  useEffect(() => {
    const savedInfo = localStorage.getItem("kterings_customer_info");
    if (savedInfo) setCustomer(JSON.parse(savedInfo));
  }, []);

   useEffect(() => {
    if (saveInfo) {
      localStorage.setItem("kterings_customer_info", JSON.stringify(customer));
    } else {
      localStorage.removeItem("kterings_customer_info");
    }
  }, [customer, saveInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            placeholder="Asad Nauman"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            placeholder="asad@gmail.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            placeholder="+1 234 567 890"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address
          </label>
          <textarea
            name="address"
            rows={3}
            value={customer.address}
            onChange={handleChange}
            placeholder="1234 Elm Street, Windsor, ON"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            required
          ></textarea>
        </div>
        {/* Save Info Toggle */}
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
      </form>
    </div>
  );
}
