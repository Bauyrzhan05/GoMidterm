import React, { useEffect, useState } from "react";
import FoodItem from "./FoodItem";
import './Style.css';
import { Link } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import '../classWork/Foods/sidebar/animation.css';

export default function Home(){

    const [foods, setFoods] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

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
    },[])

// to filter the foods
      const filtredFoods = selectedCategory 
      ? foods.filter((food) => (food.category === selectedCategory))
      : foods;

    return(
      <>
        <div className='navbar'>
            <Link to={"/"}><img src={assets.logo} alt="" className="logo" /></Link>
            <ul className='navbar-menu'>
                <Link to={"/"} >Home</Link>
                <a href="#explore-menu">menu</a>
                <a href="#footer">contact us</a>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt=""/>
                <div className="navbar-seacrh-icon">
                    <Link to="/cart"><img src={assets.basket_icon} alt=""/></Link>
                    <div></div>
                </div>
                <button>sign in</button>
            </div>
        </div>
      <br></br>
      <div className="photo">
        <div className="header-contents">
          <h2> Order your favourite food here</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente officia aut inventore culpa quisquam distinctio maxime ad cumque sequi tempora dolorum commodi, sunt maiores eum officiis aliquid sit, necessitatibus cum?</p>
        </div>
      </div>
      <br></br>
      <div className="home">

      <div className="admin-panel-link-container">
        <Link to="/admin-panel" className="admin-panel-link">
          <span className="link-text">Admin Panel</span>
          <span className="link-glow"></span>
        </Link>
      </div>
          <div className="menu-section">
            <div className="menu-header">
              <h1 className="menu-title">Explore Our Menu</h1>
              <div className="title-divider">
                <div className="divider-line"></div>
                <div className="divider-icon">✻</div>
                <div className="divider-line"></div>
              </div>
              <p className="menu-description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id cupiditate provident dolore culpa fugiat necessitatibus natus minus, illum at numquam impedit!
              </p>
            </div>
            <div className="menu-categories">
                <div className="category-list">
                    {[
                    "Salad",
                    "Rolls",
                    "Deserts",
                    "Sandwich",
                    "Pure Veg",
                    "Pasta",
                    "Noodles",
                    ].map((cat) => (
                    <button
                        key={cat}
                        className={`category-btn ${
                        selectedCategory === cat ? "active-category" : ""
                        }`}
                        onClick={() =>
                        setSelectedCategory(selectedCategory === cat ? null : cat)
                        }
                    >
                        {cat}
                    </button>
                    ))}
                </div>
            </div>
        </div> 
        <h1 className="title">Foods</h1>
        <hr></hr>
        <div className="food-container">
          {
            filtredFoods.map((food) => {
              return <FoodItem key={food.id} id={food._id} name={food.name} price={food.price} description={food.description} image={food.image} />
            })
          }
        </div>
        <br></br><br></br>

        <div className="app-download" id="app-download">
            <p>For better experience Download</p>
            <div className="app-download-platforms">
                <img src={assets.play_store}/>
                <img src={assets.app_store}/>
            </div>
        </div>
      </div>
      <br></br><br></br>
      <div className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo}/>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi unde totam doloremque eaque, mollitia veritatis natus itaque tempora inventore magnam dicta, odio accusamus harum minus rem ipsam voluptas, accusantium impedit.</p>
                    <div className="footer-social-icons">
                    <img src={assets.facebook_icon}/>
                    <img src={assets.twitter_icon}/>
                    <img src={assets.linkedin_icon}/>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>    
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IM TOUCH</h2>
                    <ul>
                        <li>+7-777-77-77</li>
                        <li>contact@tometo.com</li>
                    </ul>    
                </div>
            </div>
            <hr/>
            <p className="footer-copyright">Copyright 2025 Tometo.com - All Right Reserved.</p>
        </div>
      </>  
    )
}