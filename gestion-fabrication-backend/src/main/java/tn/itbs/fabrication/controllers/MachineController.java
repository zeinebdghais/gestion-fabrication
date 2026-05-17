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

import tn.itbs.fabrication.dto.MachineDTO;
import tn.itbs.fabrication.services.MachineService;

@RestController
@RequestMapping("/machine")
public class MachineController {
	
	@Autowired
	private MachineService machService;
	
	@GetMapping("/get/{id}")
	public MachineDTO trouverMachineParId(@PathVariable int id) {
		return machService.trouverMachineParId(id);
	}
	
	@GetMapping("/get/etat/{etat}")
	public List<MachineDTO> getMachineParEtat(@PathVariable String etat) {
		return machService.trouverMachineParEtat(etat);
	}
	
	@PostMapping("/add")
	public void ajouterMachine(@RequestBody MachineDTO mach) {
		machService.ajouterMachine(mach);
	}
	
	@DeleteMapping("/supp/{id}")
	public void supprimerMachine(@PathVariable int id) {
		machService.supprimerMachine(id);
	}
	
	@PutMapping("/modif/{id}")
	public void miseAJourMachine(@PathVariable int id, @RequestBody MachineDTO m) {
		machService.mettreAJourMachine(id, m);
	}
	
	@PutMapping("/maintenance/{id}")
	public void planifierMaintenance(@PathVariable int id) {
		machService.planifierMaintenance(id);
	}
}