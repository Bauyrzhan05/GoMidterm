import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { asset } from "../assets/admin_assets/assets";


export default function UpdateFood() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Salad");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const { id } = useParams(); 

    const fetchFood = async () => {
        try {
            const response = await fetch(`http://localhost:8080/food/list`);

            if (response.ok) {
                const foods = await response.json();
                const food = foods.data.find(item => item.id === id || item.id?.$oid === id);
                
                if (food) {
                    setName(food.name);
                    setDescription(food.description);
                    setCategory(food.category);
                    setPrice(food.price);
                    setPreviewImage(`http://localhost:8080/${food.image}`);
                } else {
                    toast.error("Food not found.");
                }
            } else {
                toast.error("Failed to fetch food data.");
            }
        } catch (error) {
            console.error("Error fetching food:", error);
            toast.error("Error loading food.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateFood = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("price", Number(price));

        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch(`http://localhost:8080/food/update/${id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error("Failed to update food.");
            }
        } catch (error) {
            console.error("Error updating food:", error);
            toast.error("Error during update.");
        }
    };

  useEffect(() => {
      fetchFood();
  },[])


    return (
        <div className="add">
            <h2>Update Food</h2>
            <form className="flex-col" onSubmit={handleUpdateFood}>
                <div className="add-img-upload flex-col">
                    <p>Food Image</p>
                    <label htmlFor="image">
                        <img src={previewImage || asset.upload_area} alt="Food preview" />
                    </label>
                    <input
                        onChange={handleImageChange}
                        type="file"
                        id="image"
                        accept="image/*"
                        hidden
                    />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        value={name}
                        placeholder="Type here"
                        required
                    />
                </div>
                <div className="add-product-discription flex-col">
                    <p>Product description</p>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        rows="6"
                        placeholder="Write content here"
                        required
                    />
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                        >
                            {[
                                "Salad",
                                "Rolls",
                                "Deserts",
                                "Sandwich",
                                "Pure Veg",
                                "Pasta",
                                "Noodles"
                            ].map((cat) => {
                                return <option key={cat} value={cat}>{cat}</option>
                            })
                            }
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            value={price}
                            placeholder="$20"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="add-btn">
                    UPDATE
                </button>
            </form>
        </div>
    );
}