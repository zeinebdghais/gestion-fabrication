package tn.itbs.fabrication.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.OrdreFabrication;
import tn.itbs.fabrication.services.OrdreFabricationService;

import java.util.List;

@RestController
@RequestMapping("/api/ordres")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrdreFabricationController {

    private final OrdreFabricationService ordreService;

    @GetMapping
    public List<OrdreFabrication> getAll() {
        return ordreService.getAll();
    }

    @GetMapping("/{id}")
    public OrdreFabrication getById(@PathVariable Long id) {
        return ordreService.getById(id);
    }

    @PostMapping
    public OrdreFabrication create(@RequestBody OrdreFabrication ordre) {
        return ordreService.create(ordre);
    }

    @PutMapping("/{id}")
    public OrdreFabrication update(@PathVariable Long id, @RequestBody OrdreFabrication ordre) {
        return ordreService.update(id, ordre);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ordreService.delete(id);
    }
}