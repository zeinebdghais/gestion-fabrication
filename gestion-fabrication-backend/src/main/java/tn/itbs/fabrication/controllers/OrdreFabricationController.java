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

import tn.itbs.fabrication.dto.OrdreFabricationDTO;
import tn.itbs.fabrication.services.OrdreFabricationService;

@RestController
@RequestMapping("/ordre")
public class OrdreFabricationController {
	
	@Autowired
	private OrdreFabricationService ordreService;
	
	@GetMapping("/get")
	public List<OrdreFabricationDTO> getAllOrdre() {
		return ordreService.trouverTousLesOrdres();
	}
	
	@GetMapping("/get/{id}")
	public OrdreFabricationDTO trouverOrdreParId(@PathVariable int id) {
		return ordreService.trouverOrdreParId(id);
	}
	
	@GetMapping("/get/etat/{etat}")
	public List<OrdreFabricationDTO> getOrdreParEtat(@PathVariable String etat) {
		return ordreService.trouverOrdreParEtat(etat);
	}
	
	@PostMapping("/add")
	public void creerOrdre(@RequestBody OrdreFabricationDTO ordre) {
		ordreService.creerOrdre(ordre);
	}
	
	@DeleteMapping("/supp/{id}")
	public void supprimerOrdre(@PathVariable int id) {
		ordreService.supprimerOrdre(id);
	}
	
	@PutMapping("/modif/{id}")
	public void miseAJourOrdre(@PathVariable int id, @RequestBody OrdreFabricationDTO o) {
		ordreService.mettreAJourOrdre(id, o);
	}
	
	@PutMapping("/assigner/{idOrdre}/{idMachine}")
	public void assignerMachine(@PathVariable int idOrdre, @PathVariable int idMachine) {
		ordreService.assignerMachine(idOrdre, idMachine);
	}
	
	@PutMapping("/demarrer/{id}")
	public void demarrerProduction(@PathVariable int id) {
		ordreService.demarrerProduction(id);
	}
	
	@PutMapping("/terminer/{id}")
	public void terminerOrdre(@PathVariable int id) {
		ordreService.terminerOrdre(id);
	}
	
	@PutMapping("/annuler/{id}")
	public void annulerOrdre(@PathVariable int id) {
		ordreService.annulerOrdre(id);
	}
}