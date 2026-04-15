package tn.itbs.fabrication.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdreFabrication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String projet;

    @Column(nullable = false)
    private int quantite;

    @Column(nullable = false, name = "date_fabrication")
    private LocalDate date;

    @Column(nullable = false, length = 50)
    private String etat;

    @ManyToOne
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    private Employe employe;
}