import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './Style.css'

export default function DeleteFood(){

    const [foods, setFoods] = useState([]);
 
    const fetchFoods = async () => {
        try {
            fetch("http://localhost:8080/food/list")
            .then(res => res.json())
            .then(data => setFoods(data.data));
        }catch(error){
            console.log("Error foods:", error)
        }
    }

    useEffect(() => {
        fetchFoods();
    }, [])
          

      const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/food/delete/${id}`, {
            method: "DELETE",
            });

            if (response.ok) {
                toast.success("Food deleted successfully!");
                setFoods(foods.filter((food) => food._id !== id)); 
                fetchFoods();
            }else {
                toast.error("Failed to delete food");
            }
        } catch (error) {
            console.error("Error deleting food:", error);
            toast.error("Error deleting food");
        }
        };

    return(
        <div className="list add flex-col">
            <p className="list">All Foods List</p>
            <div className="list-table">
                <div className="list-table-format">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Price</b>
                    <b>Update</b>
                    <b>Delete</b>
                </div>
                {
                    foods.map((food, index) => {
                        return(
                            <div key={index} className='list-table-format'>
                                <img src={`http://localhost:8080/${food.image}`} alt="" />
                                <p>{food.name}</p>
                                <p>${food.price}</p>
                                <Link to={`/admin-panel/update-food/${food.id}`}>update</Link>
                                <p onClick={() => handleDelete(food.id)} className="curser">X</p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}