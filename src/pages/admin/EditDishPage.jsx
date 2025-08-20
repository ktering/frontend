import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllChefs } from "../../api/chef";
import { getDishById, updateDishAdmin } from "../../api/admin";
import Sidebar from "../../components/admin/Sidebar";

export default function EditDishForm() {
    const { id } = useParams();
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        originalChefPrice: "",
        category: "",
        averagePrepTime: "",
        averageDeliveryTime: "",
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
    const [optionalFields, setOptionalFields] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [tags, setTags] = useState([]);
    const [modal, setModal] = useState({ success: false, error: "" });

    useEffect(() => {
        getAllChefs().then(setChefs);
        loadDish();
    }, [id]);

    const loadDish = async () => {
        try {
            const data = await getDishById(id);

            setForm({
                name: data.name || "",
                description: data.description || "",
                originalChefPrice: data.originalChefPrice || "",
                category: data.category || "",
                averagePrepTime: data.averagePrepTime || "",
                averageDeliveryTime: data.averageDeliveryTime || "",
                halal: data.halal || false,
                kosher: data.kosher || false,
                vegetarian: data.vegetarian || false,
                containsNuts: data.containsNuts || false,
                meatType: data.meatType || "",
                ethnicType: data.ethnicType || "",
                // chefId: data.chefId || ""
                chefId: data.chefId?._id || "" 
            });
            const cleanedIngredients = Array.isArray(data.ingredients)
                ? data.ingredients.filter(item => item.trim() !== "")
                : [];

            const cleanedTags = Array.isArray(data.tags)
                ? data.tags.filter(item => item.trim() !== "")
                : [];

            setIngredients(cleanedIngredients);
            setTags(cleanedTags);

            setOptionalFields({
                ingredients: cleanedIngredients.length > 0,
                tags: cleanedTags.length > 0,
                averagePrepTime: !!data.averagePrepTime,
                averageDeliveryTime: !!data.averageDeliveryTime,
                meatType: !!data.meatType,
                ethnicType: !!data.ethnicType
            });



            if (data.image) setPreview(data.image);

        } catch (err) {
            console.error("Failed to fetch dish", err);
        }

    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        if (name === "originalChefPrice") {
            // Ensure the price is positive and a valid number
            if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
                setForm(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setForm(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const updateFieldList = (setter, index, value) => {
        setter((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const removeFromList = (setter, index) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    const addToList = (setter) => {
        setter((prev) => [...prev, ""]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(form.originalChefPrice) <= 0) {
            setModal({ success: false, error: "Price must be a positive number greater than zero." });
            return;
        }
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }
        if (image) formData.append("image", image);
        if (optionalFields.ingredients) formData.append("ingredients", JSON.stringify(ingredients));
        if (optionalFields.tags) formData.append("tags", JSON.stringify(tags));

        try {
            setSubmitting(true); // ← start loading
            await updateDishAdmin(id, formData);
            setModal({ success: true, error: "" });
            setTimeout(() => navigate("/supervised/dishes/chef"), 3000);
        } catch (err) {
            setModal({ success: false, error: err.message });
        }
        finally {
            setSubmitting(false); // ← stop loading
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 w-full bg-gray-100 min-h-screen py-8 px-4">
                <div className="w-full max-w-4xl bg-white mx-auto p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-primary text-center mb-6">Edit Dish</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-4">Basic Information</h3>
                            <label className="font-semibold block mb-1">Name</label>
                            <input name="name" required value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Dish Name" />
                            <hr className="my-4" />
                            <label className="font-semibold block mb-1">Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                            {preview && <img src={preview} alt="Preview" className="h-40 mt-2 rounded" />}
                            <hr className="my-4" />
                            <label className="font-semibold block mb-1">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Description" />
                            <hr className="my-4" />
                            <label className="font-semibold block mb-1">Price *</label>
                            <small className="text-gray-600">This is the price the Kterer will receive for this dish.</small>
                            <input name="originalChefPrice" type="number" value={form.originalChefPrice} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Original Kterer Price" />
                            <hr className="my-4" />
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
                            <hr className="my-4" />
                            <label className="font-semibold block mb-1">Kterer</label>
                            <select
    name="chefId"
    value={form.chefId}
    onChange={handleChange}
    required
    className="w-full border rounded px-3 py-2"
    disabled={!!form.chefId} // ✅ disables if a chef is already assigned
>
    <option value="">-- Select Kterer --</option>
    {chefs.map(chef => (
        <option key={chef._id} value={chef._id}>{chef.name}</option>
    ))}
</select>

{form.chefId && (
    <div className="mt-2 text-sm text-gray-600 italic">
        Assigned Kterer: <span className="font-semibold text-primary">
            {chefs.find(c => c._id === form.chefId)?.name || "Unknown Kterer"}
        </span>
    </div>
)}

                        </div>


                        <hr className="my-4" />
                        <div className="bg-white border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-4">Optional Fields</h3>
                            <hr className="my-4" />
                            {optionalFields.meatType ? (
                                <div>
                                    <label className="font-semibold block mb-1">Meat Type</label>
                                    <select name="meatType" value={form.meatType} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                        <option value="">-- Select Meat Type --</option>
                                        <option value="Hand-slaughtered">Hand-slaughtered</option>
                                        <option value="Machine-slaughtered">Machine-slaughtered</option>
                                    </select>
                                </div>
                            ) : (
                                <button type="button" onClick={() => setOptionalFields(prev => ({ ...prev, meatType: true }))} className="bg-primary text-white px-4 py-2 rounded-full mb-4 block">+ Add Meat Type</button>
                            )}



                            {["averagePrepTime", "averageDeliveryTime", "ethnicType"].map((field) => (
                                <div key={field}>
                                    <hr className="my-4" />
                                    {!optionalFields[field] ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOptionalFields((prev) => ({ ...prev, [field]: true }))
                                            }
                                            className="bg-primary text-white px-4 py-2 rounded-full mb-4 block"
                                        >
                                            + Add {field}
                                        </button>
                                    ) : (
                                        <>
                                            <label className="font-semibold block mb-1 capitalize">{field}</label>
                                            <input
                                                name={field}
                                                value={form[field]}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder={field}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}

                            <hr className="my-4" />

                            {!optionalFields.ingredients ? (

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOptionalFields(prev => ({ ...prev, ingredients: true }));
                                        setIngredients([""]); // add empty field directly
                                    }}
                                    className="bg-primary text-white px-4 py-2 rounded-full"
                                >
                                    + Add Ingredients
                                </button>
                            ) : (
                                <div>
                                    <label className="font-semibold block mb-1">Ingredients</label>
                                    {ingredients.map((ing, idx) => (
                                        <div key={idx} className="flex gap-2 items-center mt-2">
                                            <input
                                                value={ing}
                                                onChange={e => updateFieldList(setIngredients, idx, e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder={`Ingredient #${idx + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFromList(setIngredients, idx)}
                                                className="bg-red-600 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addToList(setIngredients)}
                                        className="bg-primary text-white px-4 py-2 rounded-full mt-2"
                                    >
                                        + Add Another Ingredient
                                    </button>
                                </div>
                            )}

                            <hr className="my-4" />
                            {!optionalFields.tags ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOptionalFields(prev => ({ ...prev, tags: true }));
                                        setTags([""]); // ensures one field shows up
                                    }}
                                    className="bg-primary text-white px-4 py-2 rounded-full"
                                >
                                    + Add Tags
                                </button>
                            ) : (
                                <div>

                                    <label className="font-semibold block mb-1">Tags</label>
                                    {tags.map((tag, idx) => (
                                        <div key={idx} className="flex gap-2 items-center mt-2">
                                            <input
                                                value={tag}
                                                onChange={e => updateFieldList(setTags, idx, e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder={`Tag #${idx + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFromList(setTags, idx)}
                                                className="bg-red-600 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addToList(setTags)}
                                        className="bg-primary text-white px-4 py-2 rounded-full mt-2"
                                    >
                                        + Add Another Tag
                                    </button>
                                    <hr className="my-4" />
                                </div>
                            )}


                        </div>

                        <hr className="my-4" />
                        <div className="bg-white border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-4">Dietary Preferences (check all that apply):</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {["halal", "kosher", "vegetarian", "containsNuts"].map(field => (
                                    <label key={field} className="flex items-center">
                                        <input type="checkbox" name={field} checked={form[field]} onChange={handleChange} className="mr-2 h-4 w-4 text-primary" /> {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white font-bold w-full py-3 rounded-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting && (
                                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
                                </svg>
                            )}
                            {submitting ? "Updating..." : "Update Dish"}
                        </button>

                    </form>

                    {/* Success Modal */}
                    {modal.success && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 font-nunito">
                            <div className="bg-white border border-green-300 rounded-2xl shadow-xl max-w-md w-full px-6 py-8 text-center animate-fade-in">
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <svg
                                        className="w-12 h-12 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                {/* Message */}
                                <h2 className="text-xl font-bold text-green-600 mb-2">Dish Updated Successfully!</h2>
                                <p className="text-gray-600">Your dish changes have been saved.</p>
                                {/* Button */}
                                <button
                                    onClick={() => setModal({ success: false, error: "" })}
                                    className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold transition"
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

