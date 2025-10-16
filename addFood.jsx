import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { asset } from "../assets/admin_assets/assets";
import './Style.css'

export default function AddFood(){

    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] =  useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Salad");


    const onSubmitHandler =  async (event) => {
            event.preventDefault();
    
            const formData = new FormData(); 
    
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", Number(price));
            formData.append("category", category);
            formData.append("image", image);
    
            const response = await fetch(`http://localhost:8080/food/add`, {
                method: "POST",
                body: formData 
            });
    
            const data = await response.json();
    
            if (data.success) {
                setName("");
                setDescription("");
                setPrice("");
                setCategory("Salad");
                setImage(null);
    
                toast.success(data.message || "Food added successfully!");
            }else{
                toast.error(data.message || "Failed to add food");
            }
        }

    return(
        <div className="add">
            <h1>Add food</h1>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : asset.upload_area}/>
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required/>
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input onChange={(e) => setName(e.target.value)} type="text" value={name} placeholder="Type here"/>
                </div>
                <div className="add-product-discription flex-col">
                    <p>Product description</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} rows="6" placeholder="Write content here" required/>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={(e) => setCategory(e.target.value)} value={category}>
                            {
                               [
                                "Salad",
                                "Rolls",
                                "Deserts",
                                "Sandwich",
                                "Pure Veg",
                                "Pasta",
                                "Noodles",
                                ].map((cat) => {
                                    return <option key={cat} value={cat}>{cat}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input onChange={(e) => setPrice(e.target.value)} type="text" value={price} placeholder="$20"/>
                    </div>
                </div>
                <button type="submit" className="add-btn">ADD</button>
            </form>
        </div>
    )
}