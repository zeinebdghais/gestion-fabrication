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

import tn.itbs.fabrication.dto.EmployeDTO;
import tn.itbs.fabrication.dto.OrdreFabricationDTO;
import tn.itbs.fabrication.services.EmployeService;

@RestController
@RequestMapping("/employe")
public class EmployeController {
	
	@Autowired
	private EmployeService empService;
	
	@GetMapping("/get")
	public List<EmployeDTO> getAllEmployees() {
		return empService.trouverTousLesEmployes();
	}
	
	@GetMapping("/get/{id}")
	public EmployeDTO trouverEmployeParId(@PathVariable int id) {
		return empService.trouverEmployeParId(id);
	}
	
	@PostMapping("/add")
	public void ajouterEmploye(@RequestBody EmployeDTO emp) {
		empService.ajouterEmploye(emp);
	}
	
	@DeleteMapping("/supp/{id}")
	public void supprimerEmploye(@PathVariable int id) {
		empService.supprimerEmploye(id);
	}
	
	@PutMapping("/modif/{id}")
	public void miseAJourEmploye(@PathVariable int id, @RequestBody EmployeDTO e) {
		empService.mettreAJourEmploye(id, e);
	}
	
	@PutMapping("/assigner/{idEmploye}/{idMachine}")
	public void assignerMachine(@PathVariable int idEmploye, @PathVariable int idMachine) {
		empService.assignerMachine(idEmploye, idMachine);
	}
}