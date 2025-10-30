package routes

import (
	"MyProject1/Midterm1/handlers"

	"github.com/gorilla/mux"
)

func FoodRoutes(r *mux.Router) {
	r.HandleFunc("/food/add", handlers.AddFoodHandler).Methods("POST")
	r.HandleFunc("/food/list", handlers.ListFoodsHandler).Methods("GET")
	r.HandleFunc("/food/update/{id}", handlers.UpdateFoodHandler).Methods("PUT")
	r.HandleFunc("/food/delete/{id}", handlers.DeleteFoodHandler).Methods("DELETE")
}

func AuthRoutes(r *mux.Router) {
	r.HandleFunc("/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/login", handlers.LoginHandler).Methods("POST")
}
