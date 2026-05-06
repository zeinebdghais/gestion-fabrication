package tn.itbs.fabrication.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdreFabrication {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String projet;

    @Column(nullable = false)
    private Integer quantite;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String etat;

    @ManyToOne
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;
  
}