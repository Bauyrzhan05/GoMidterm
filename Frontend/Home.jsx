import React, { useEffect, useState } from "react";
import FoodItem from "./FoodItem";
import './Style.css';
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import '../classWork/Foods/sidebar/animation.css';
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./Redux/export";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";

export default function Home(){

  const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [currState, setCurrState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); 

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

      const onLogin = async (e) => {
        e.preventDefault();

        if (currState === "Sign up") {
                  try {
                      const response = await fetch("http://localhost:8080/register", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userName: name, userEmail: email, password, role, }),
                      });
                      if (response.ok ) {
                          setCurrState("Login")
                          toast.success(`Registration successful ${name}!`)
                      }else {
                          toast.error("Registration failed");
                      }
                  } catch (error) {
                      console.log(error);
                      toast.error("Server error");
                  }
              } else {
                  // Login
                  try {

                      const res = await fetch("http://localhost:8080/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userEmail: email,
                          password: password
                        }),
                      });
                      const data = await res.json();

                      if (data.token){
                        const decodedUser = jwtDecode(data.token);
                        dispatch(login(decodedUser));
                        setShowLogin(false);
                      }else toast.error("User not found")
                  } catch (error) {
                      console.log(error);
                   toast.error("Login failed");
                  }
              }
          
      }

      
      const handleLogout = () => {
        dispatch(logout());
        navigate("/");
      }

    useEffect(() => {
      const stored = localStorage.getItem("user");
      if (stored && !user) {
        try {
          const parsed = JSON.parse(stored);
          dispatch(login(parsed));
        } catch (err) {
          console.log("Invalid stored user", err);
        }
      }
    }, [dispatch, user]);
  
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
                {!user ? 
                <button onClick={() => setShowLogin(true)}>sign in</button>
                :<div className='navbar-profile'>
                    <img src={assets.profile_icon} />
                    <p>{user.userName}</p>
                    <ul className="nav-profile-dropdown">
                        <li onClick={handleLogout} ><img src={assets.logout_icon}/><a href="">Logout</a></li>
                    </ul>
                </div>
                }
            </div>
        </div>

        {showLogin && (
                        <div className="login-popup">
                            <form className="login-popup-container" onSubmit={onLogin}>
                                <div className="login-popup-title">
                                    <h2>{currState}</h2>
                                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
                                </div>
                                <div className="login-popup-inputs">
                                    {currState === "Login" ? null : (
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    )}
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    {
                                        currState === "Login" ? null 
                                        :<div className="role-select-container">
                                            <h4>Choose a role:</h4>
                                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                                <option value="user">User</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    }
                                </div>
                                <button type="submit">
                                    {currState === "Sign up" ? "Create Account" : "Login"}
                                </button>
                                <div className="login-popup-condition">
                                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                                </div>
                                {currState === "Login" ? (
                                    <p>Create a new account? <span onClick={() => setCurrState("Sign up")}>Click here</span></p>
                                ) : (
                                    <p>Already have an account? <span onClick={() => setCurrState("Login")}>Click here</span></p>
                                )}
                            </form>
                        </div>
                    )}

      <br></br>
      <div className="photo">
        <div className="header-contents">
          <h2> Order your favourite food here</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente officia aut inventore culpa quisquam distinctio maxime ad cumque sequi tempora dolorum commodi, sunt maiores eum officiis aliquid sit, necessitatibus cum?</p>
        </div>
      </div>
      <br></br>
      <div className="home">

            {user?.role === 'admin' 
            ?<div className="admin-panel-link-container">
              <Link to="/admin-panel" className="admin-panel-link">
                <span className="link-text">Admin Panel</span>
                <span className="link-glow"></span>
              </Link>
            </div>
            : <></>
            }
            {user?.role === 'manager' 
            ?<div className="admin-panel-link-container">
              <Link to="/orders-manager" className="admin-panel-link">
                <span className="link-text">Manager order panel</span>
                <span className="link-glow"></span>
              </Link>
            </div>
            : <></>
            }
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
              return <FoodItem key={food.id} id={food.id} name={food.name} price={food.price} description={food.description} image={food.image} />
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