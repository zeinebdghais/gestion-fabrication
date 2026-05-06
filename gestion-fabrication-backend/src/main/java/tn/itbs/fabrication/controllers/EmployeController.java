package tn.itbs.fabrication.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.itbs.fabrication.entities.Employe;
import tn.itbs.fabrication.services.EmployeService;

@RestController
@RequestMapping("/employe")
public class EmployeController {
	
	@Autowired
	private EmployeService empService;
	
	@GetMapping("/get/{id}")
	public Optional<Employe> trouverEmployeParId(@PathVariable int id) {
		return empService.trouverEmployeParId(id);
	}
	
	@PostMapping("/add")
	public void ajouterEmploye(@RequestBody Employe emp) {
		empService.ajouterEmploye(emp);
	}
	
	@DeleteMapping("/supp/{id}")
	public void supprimerEmploye(@PathVariable int id) {
		empService.supprimerEmploye(id);
	}
	
	@PutMapping("/modif/{id}")
	public void miseAJourEmploye(@PathVariable int id, @RequestBody Employe e) {
		empService.mettreAJourEmploye(id, e);
	}
	
	@PutMapping("/assigner/{idEmploye}/{idMachine}")
	public void assignerMachine(@PathVariable int idEmploye, @PathVariable int idMachine) {
		empService.assignerMachine(idEmploye, idMachine);
	}
}