package tn.itbs.fabrication.dto;

import lombok.Data;

@Data
public class ProduitDTO {
	private int id;
	private String nom;
	private String type;
	private Integer stock;
	private String fournisseur;

}
