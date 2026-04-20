package tn.itbs.fabrication.controllers;

import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.OrdreFabrication;
import tn.itbs.fabrication.services.OrdreFabricationService;

import java.util.List;

@RestController
@RequestMapping("/api/ordres")
@CrossOrigin("*")
public class OrdreFabricationController {

    private final OrdreFabricationService service;

    public OrdreFabricationController(OrdreFabricationService service) {
        this.service = service;
    }

    @PostMapping
    public OrdreFabrication creer(
            @RequestParam Long produitId,
            @RequestParam Long machineId,
            @RequestParam int quantite,
            @RequestParam String projet) {

        return service.creerOrdre(produitId, machineId, quantite, projet);
    }

    @GetMapping
    public List<OrdreFabrication> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}/etat")
    public OrdreFabrication changerEtat(
            @PathVariable Long id,
            @RequestParam String etat) {

        return service.changerEtat(id, etat);
    }

    @GetMapping("/en-cours")
    public List<OrdreFabrication> getEnCours() {
        return service.getOrdresEnCours();
    }
}