package tn.itbs.fabrication.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.Produit;
import tn.itbs.fabrication.services.ProduitService;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProduitController {

    private final ProduitService produitService;

    @GetMapping
    public List<Produit> getAll() {
        return produitService.getAll();
    }

    @GetMapping("/{id}")
    public Produit getById(@PathVariable Long id) {
        return produitService.getById(id);
    }

    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return produitService.create(produit);
    }

    @PutMapping("/{id}")
    public Produit update(@PathVariable Long id, @RequestBody Produit produit) {
        return produitService.update(id, produit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        produitService.delete(id);
    }
}