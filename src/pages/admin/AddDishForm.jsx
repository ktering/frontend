// src/pages/admin/AddDishForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDishAdmin } from "../../api/admin";
import { getAllChefs } from "../../api/chef";
import { X } from "lucide-react";
import Sidebar from "../../components/admin/Sidebar";

export default function AddDishForm() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        averagePrepTime: "",
        averageDeliveryTime: "",
        tags: [""],
        halal: false,
        kosher: false,
        vegetarian: false,
        containsNuts: false,
        meatType: "",
        ethnicType: "",
        chefId: ""
    });
    const [chefs, setChefs] = useState([]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [optionalFields, setOptionalFields] = useState({
        ingredients: false,
        meatType: false,
        ethnicType: false,
        averagePrepTime: false,
        averageDeliveryTime: false,
        tags: false
    });
    const [ingredients, setIngredients] = useState([""]);
    const [tags, setTags] = useState([""]);
    const [modal, setModal] = useState({ success: false, error: "" });
    const navigate = useNavigate();

    useEffect(() => {
        getAllChefs().then(setChefs);
    }, []);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleIngredientChange = (index, value) => {
        const updated = [...ingredients];
        updated[index] = value;
        setIngredients(updated);
    };

    const removeIngredient = index => {
        const updated = ingredients.filter((_, i) => i !== index);
        setIngredients(updated);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, ""]);
    };

    const handleTagChange = (index, value) => {
        const updated = [...tags];
        updated[index] = value;
        setTags(updated);
    };

    const removeTag = index => {
        const updated = tags.filter((_, i) => i !== index);
        setTags(updated);
    };

    const addTagField = () => {
        setTags([...tags, ""]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("averagePrepTime", form.averagePrepTime);
        formData.append("averageDeliveryTime", form.averageDeliveryTime);
        formData.append("tags", JSON.stringify(tags));
        formData.append("halal", form.halal);
        formData.append("kosher", form.kosher);
        formData.append("vegetarian", form.vegetarian);
        formData.append("containsNuts", form.containsNuts);
        formData.append("meatType", form.meatType);
        formData.append("ethnicType", form.ethnicType);
        formData.append("chefId", form.chefId);
        if (image) formData.append("image", image);
        if (optionalFields.ingredients) formData.append("ingredients", JSON.stringify(ingredients));

        try {
            await createDishAdmin(formData);
            setModal({ success: true, error: "" });
            setTimeout(() => navigate("/supervised/dishes"), 3000);
        } catch (err) {
            setModal({ success: false, error: err.message });
        }
    };

    return (

        <div className="flex">
            <Sidebar />

            {/* Main Form Content Area */}
            <div className="ml-64 w-full bg-gray-100 min-h-screen py-8 px-4">
                <div className="w-full max-w-4xl bg-white mx-auto p-6 rounded-lg shadow-md">
                    {/* ...form content stays the same... */}
                    <h2 className="text-2xl font-bold text-primary text-center mb-6">Add New Dish</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-semibold block mb-1">Name *</label>
                            <input name="name" required value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Image *</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full" />
                            {preview && <div className="mt-2"><img src={preview} alt="Preview" className="h-40 rounded" /></div>}
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Price *</label>
                            <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Category</label>
                            <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                <option value="">-- Select Category --</option>
                                <option value="trending">Trending</option>
                                <option value="asian">Asian</option>
                                <option value="middle-eastern">Middle Eastern</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="desserts">Desserts</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Chef *</label>
                            <select name="chefId" value={form.chefId} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                                <option value="">-- Select Chef --</option>
                                {chefs.map(chef => (
                                    <option key={chef._id} value={chef._id}>{chef.name}</option>
                                ))}
                            </select>
                        </div>

                        <hr className="my-6" />
                        <h3 className="text-lg font-bold text-gray-700">Optional Fields</h3>

                        {/* Average Prep Time */}
                        <hr className="my-4" />
                        {!optionalFields.averagePrepTime && (
                            <button type="button" onClick={() => setOptionalFields(prev => ({ ...prev, averagePrepTime: true }))} className="bg-primary text-white px-4 py-2 rounded-full">Add Average Prep Time</button>
                        )}
                        {optionalFields.averagePrepTime && (
                            <div className="mt-4">
                                <label className="font-semibold block mb-1">Average Prep Time</label>
                                <input name="averagePrepTime" placeholder="e.g. 30 minutes" value={form.averagePrepTime} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                            </div>
                        )}

                        {/* Average Delivery Time */}
                        <hr className="my-4" />
                        {!optionalFields.averageDeliveryTime && (
                            <button type="button" onClick={() => setOptionalFields(prev => ({ ...prev, averageDeliveryTime: true }))} className="bg-primary text-white px-4 py-2 rounded-full">Add Average Delivery Time</button>
                        )}
                        {optionalFields.averageDeliveryTime && (
                            <div className="mt-4">
                                <label className="font-semibold block mb-1">Average Delivery Time</label>
                                <input name="averageDeliveryTime" placeholder="e.g. 20 minutes" value={form.averageDeliveryTime} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                            </div>
                        )}

                        {/* Tags */}
                        <hr className="my-4" />
                        {!optionalFields.tags && (
                            <button type="button" onClick={() => setOptionalFields(prev => ({ ...prev, tags: true }))} className="bg-primary text-white px-4 py-2 rounded-full">Add Tags</button>
                        )}
                        {optionalFields.tags && (
                            <div className="mt-4">
                                <label className="font-semibold block mb-1">Tags</label>
                                {tags.map((tag, idx) => (
                                    <div key={idx} className="flex gap-2 items-center mt-2">
                                        <input value={tag} onChange={e => handleTagChange(idx, e.target.value)} placeholder={`Tag #${idx + 1}`} className="w-full border rounded px-3 py-2" />
                                        <button type="button" onClick={() => removeTag(idx)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addTagField} className="bg-primary text-white px-4 py-2 rounded-full mt-2">+ Add Another Tag</button>
                            </div>
                        )}

                        {/* Ingredients */}
                        <hr className="my-4" />
                        {!optionalFields.ingredients && (
                            <button type="button" onClick={() => setOptionalFields(prev => ({ ...prev, ingredients: true }))} className="bg-primary text-white px-4 py-2 rounded-full">Add Ingredients</button>
                        )}
                        {optionalFields.ingredients && (
                            <div className="mt-4">
                                <label className="font-semibold block mb-1">Ingredients</label>
                                {ingredients.map((ing, idx) => (
                                    <div key={idx} className="flex gap-2 items-center mt-2">
                                        <input value={ing} onChange={e => handleIngredientChange(idx, e.target.value)} placeholder={`Ingredient #${idx + 1}`} className="w-full border rounded px-3 py-2" />
                                        <button type="button" onClick={() => removeIngredient(idx)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addIngredientField} className="bg-primary text-white px-4 py-2 rounded-full mt-2">+ Add Another Ingredient</button>
                            </div>
                        )}

                        {/* Meat Type */}
                        <hr className="my-4" />
                        {!optionalFields.meatType && (
                            <button type="button" onClick={() => setOptionalFields(prev => ({ ...prev, meatType: true }))} className="bg-primary text-white px-4 py-2 rounded-full">Add Meat Type</button>
                        )}
                        {optionalFields.meatType && (
                            <>
                                <label className="font-semibold block mt-2">Meat Type</label>
                                <select name="meatType" value={form.meatType} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                    <option value="">-- Select Meat Type --</option>
                                    <option value="Hand-slaughtered">Hand-slaughtered</option>
                                    <option value="Machine-slaughtered">Machine-slaughtered</option>
                                </select>
                            </>
                        )}

                        {/* Ethnic Type */}
                        <hr className="my-4" />
                        {!optionalFields.ethnicType && (
                            <button type="button" onClick={() => setOptionalFields(prev => ({ ...prev, ethnicType: true }))} className="bg-primary text-white px-4 py-2 rounded-full">Add Ethnic Type</button>
                        )}
                        {optionalFields.ethnicType && (
                            <>
                                <label className="font-semibold block mt-2">Ethnic Type</label>
                                <input name="ethnicType" value={form.ethnicType} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                            </>
                        )}

                        {/* Dietary Preferences */}
                        <hr className="my-6" />
                        <label className="font-semibold block mb-2">Dietary Preferences (check all that apply):</label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center">
                                <input type="checkbox" name="halal" checked={form.halal} onChange={handleChange} className="mr-2 h-4 w-4 text-primary" /> Halal
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" name="kosher" checked={form.kosher} onChange={handleChange} className="mr-2 h-4 w-4 text-primary" /> Kosher
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" name="vegetarian" checked={form.vegetarian} onChange={handleChange} className="mr-2 h-4 w-4 text-primary" /> Vegetarian
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" name="containsNuts" checked={form.containsNuts} onChange={handleChange} className="mr-2 h-4 w-4 text-primary" /> Nut-Free
                            </label>
                        </div>



                        <button type="submit" className="bg-primary hover:bg-primary/90 text-white text-lg font-bold w-full mt-6 py-3 rounded-full">Submit Dish</button>


                    </form>

                    {/* Success Modal */}
                    {modal.success && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 font-nunito">
                            <div className="bg-white border border-primary/20 rounded-2xl shadow-xl max-w-md w-full px-6 py-8 text-center animate-fade-in">
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <svg
                                        className="w-12 h-12 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                {/* Message */}
                                <h2 className="text-xl font-bold text-primary mb-2">Dish Added Successfully!</h2>
                                <p className="text-gray-600">Your new dish has been saved to the menu.</p>

                                {/* Button */}
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
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <svg
                                        className="w-12 h-12 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>

                                {/* Message */}
                                <h2 className="text-xl font-bold text-red-600 mb-2">Something Went Wrong</h2>
                                <p className="text-gray-600">{modal.error}</p>

                                {/* Button */}
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

            </div>
        </div>


    );
}
