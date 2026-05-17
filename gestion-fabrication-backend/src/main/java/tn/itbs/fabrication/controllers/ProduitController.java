package tn.itbs.fabrication.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.itbs.fabrication.dto.ProduitDTO;
import tn.itbs.fabrication.services.ProduitService;

@RestController
@RequestMapping("/produit")
public class ProduitController {
	
	@Autowired
	private ProduitService prodService;
	
	@GetMapping("/get/{id}")
	public ProduitDTO trouverProduitParId(@PathVariable int id) {
		return prodService.trouverProduitParId(id);
	}
	
	@GetMapping("/get/nom/{nom}")
	public List<ProduitDTO> getProduitParNom(@PathVariable String nom) {
		return prodService.trouverProduitParNom(nom);
	}
	
	@PostMapping("/add")
	public void ajouterProduit(@RequestBody ProduitDTO prod) {
		prodService.ajouterProduit(prod);
	}
	
	@DeleteMapping("/supp/{id}")
	public void supprimerProduit(@PathVariable int id) {
		prodService.supprimerProduit(id);
	}
	
	@PutMapping("/modif/{id}")
	public void miseAJourProduit(@PathVariable int id, @RequestBody ProduitDTO p) {
		prodService.mettreAJourProduit(id, p);
	}
}