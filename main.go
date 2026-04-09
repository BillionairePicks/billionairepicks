package main

import (
	"net/http"
	"log"
	"html/template"
)

// Create a struct to hold user configuration
type Config struct {
	Port string
}

// Function to load templates (HTML files)
func loadTemplates() *template.Template {
	return template.Must(template.ParseGlob("static/templates/*.html"))
}

// Handler for the home route
func homeHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := loadTemplates()
	err := tmpl.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	config := Config{Port: ":8080"}
	http.HandleFunc("/", homeHandler)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static/"))))
	log.Println("Starting server on port", config.Port)
	log.Fatal(http.ListenAndServe(config.Port, nil))
}