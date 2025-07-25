const BASE_URL = "http://localhost:5000/api/dishes"; // or your full backend URL if needed

export async function fetchAllDishes() {
  try {
    const res = await fetch(`${BASE_URL}`);
    return await res.json();
  } catch {
    return [];
  }
}

export const fetchDishBySlug = async (slug) => {
  try {
    const res = await fetch(`http://localhost:5000/api/dishes/slug/${slug}`);
    if (!res.ok) {
      throw new Error("Failed to fetch dish by slug");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching dish by slug:", error);
    return null;
  }
};


export async function fetchDishesByCategory(category) {
  try {
    const res = await fetch(`${BASE_URL}/category/${category}`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchDishesByTag(tag) {
  try {
    const res = await fetch(`${BASE_URL}/tag/${tag}`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAllCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAllTags() {
  try {
    const res = await fetch(`${BASE_URL}/tags`);
    return await res.json();
  } catch {
    return [];
  }
}
