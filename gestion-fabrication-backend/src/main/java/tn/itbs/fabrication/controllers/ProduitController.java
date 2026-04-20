package tn.itbs.fabrication.controllers;

import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.services.ProduitService;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin("*")
public class ProduitController {

    private final ProduitService service;

    public ProduitController(ProduitService service) {
        this.service = service;
    }

    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return service.create(produit);
    }

    @GetMapping
    public List<Produit> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Produit getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Produit update(@PathVariable Long id, @RequestBody Produit produit) {
        produit.setId(id);
        return service.create(produit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    //@GetMapping("/stock-faible/{seuil}")
    //public List<Produit> stockFaible(@PathVariable int seuil) {
        //return service.getStockFaible(seuil);
    //}
}