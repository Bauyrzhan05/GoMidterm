package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"MyProject1/Midterm1/config"
	"MyProject1/Midterm1/routes"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	client := config.ConnectMongo()
	defer client.Disconnect(context.TODO())

	r := mux.NewRouter()
	routes.FoodRoutes(r)
	routes.AuthRoutes(r)

	r.PathPrefix("/Midterm1/uploads/").
		Handler(http.StripPrefix("/Midterm1/uploads/", http.FileServer(http.Dir("Midterm1/uploads"))))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	fmt.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
