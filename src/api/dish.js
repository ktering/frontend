// src/api/dish.js
import { API_BASE } from "../../config";

export async function getDishesByChef(chefId) {
  const res = await fetch(`${API_BASE}/api/dishes/chef/${chefId}`);
  if (!res.ok) throw new Error("Error fetching dishes");
  return res.json();
}

export async function fetchAllDishes() {
  try {
    const res = await fetch(`${API_BASE}/api/dishes`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchDishBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/slug/${slug}`);
    if (!res.ok) {
      throw new Error("Failed to fetch dish by slug");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching dish by slug:", error);
    return null;
  }
}

export async function fetchDishesByCategory(category) {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/category/${category}`);
    console.log("Fetching dishes by category:", category);
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchDishesByTag(tag) {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/tag/${tag}`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAllCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/categories`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAllTags() {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/tags`);
    return await res.json();
  } catch {
    return [];
  }
}
