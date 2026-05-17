package tn.itbs.fabrication.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tn.itbs.fabrication.converters.ProduitConverter;
import tn.itbs.fabrication.dto.ProduitDTO;
import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.repositories.ProduitRepository;

@Service
public class ProduitService {
	
	@Autowired
	private ProduitRepository produitRepo;
	
	@Autowired
	private ProduitConverter produitConverter;
	
	public List<ProduitDTO> trouverTousLesProduits() {
		List<Produit> produits = produitRepo.findAll();
		return produitConverter.toDtoList(produits);
	}
	
	public ProduitDTO trouverProduitParId(int id) {
		Produit produit = produitRepo.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Produit non trouvé"));
		return produitConverter.toDto(produit);
	}
	
	public List<ProduitDTO> trouverProduitParNom(String nom) {
		List<Produit> produits = produitRepo.findByNom(nom);
		return produitConverter.toDtoList(produits);
	}
	
	public void ajouterProduit(ProduitDTO produitDTO) {
		Produit produit = produitConverter.fromDto(produitDTO);
		produitRepo.save(produit);
	}
	
	public ResponseEntity<String> supprimerProduit(int id) {
		produitRepo.findById(id).ifPresentOrElse(
			p -> {
				produitRepo.deleteById(id);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Produit non trouvé");
			}
		);
		return ResponseEntity.ok("Suppression avec succès");
	}
	
	public ResponseEntity<String> mettreAJourProduit(int id, ProduitDTO produitDTO) {
		produitRepo.findById(id).ifPresentOrElse(
			p -> {
				p.setNom(produitDTO.getNom());
				p.setType(produitDTO.getType());
				p.setStock(produitDTO.getStock());
				p.setFournisseur(produitDTO.getFournisseur());
				produitRepo.save(p);
			},
			() -> {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Produit non trouvé");
			}
		);
		return ResponseEntity.ok("Mise à jour avec succès");
	}
}