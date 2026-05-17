package tn.itbs.fabrication.converters;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tn.itbs.fabrication.dto.ProduitDTO;
import tn.itbs.fabrication.entities.Produit;

@Component
public class ProduitConverter {

    @Autowired
    private ModelMapper modelMapper;

    public ProduitDTO toDto(Produit produit) {
        return modelMapper.map(produit, ProduitDTO.class);
    }

    public Produit fromDto(ProduitDTO produitDTO) {
        return modelMapper.map(produitDTO, Produit.class);
    }

    public List<ProduitDTO> toDtoList(List<Produit> produits) {
        return produits.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<Produit> fromDtoList(List<ProduitDTO> produitDTOs) {
        return produitDTOs.stream()
                .map(this::fromDto)
                .collect(Collectors.toList());
    }
}