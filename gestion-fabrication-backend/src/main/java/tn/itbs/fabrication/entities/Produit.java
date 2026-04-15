package tn.itbs.fabrication.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false, length = 100)
    private String fournisseur;

    @OneToMany(mappedBy = "produit")
    @JsonIgnore
    private List<OrdreFabrication> ordresFabrication;
}