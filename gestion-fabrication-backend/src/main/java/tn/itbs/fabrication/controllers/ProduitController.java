package tn.itbs.fabrication.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.services.ProduitService;

import java.util.List;

import java.util.Optional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/produit")
public class ProduitController {
	
	@Autowired
	private ProduitService prodService;
	
	@GetMapping("/get/{id}")
	public Optional<Produit> trouverProduitParId(@PathVariable int id) {
		return prodService.trouverProduitParId(id);
	}
	
	@GetMapping("/get/nom/{nom}")
	public List<Produit> getProduitParNom(@PathVariable String nom) {
		return prodService.trouverProduitParNom(nom);
	}
	
	@PostMapping("/add")
	public void ajouterProduit(@RequestBody Produit prod) {
		prodService.ajouterProduit(prod);
	}
	
	@DeleteMapping("/supp/{id}")
	public void supprimerProduit(@PathVariable int id) {
		prodService.supprimerProduit(id);
	}
	
	@PutMapping("/modif/{id}")
	public void miseAJourProduit(@PathVariable int id, @RequestBody Produit p) {
		prodService.mettreAJourProduit(id, p);
	}
}