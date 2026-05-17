package tn.itbs.fabrication.converters;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tn.itbs.fabrication.dto.OrdreFabricationDTO;
import tn.itbs.fabrication.entities.OrdreFabrication;

@Component
public class OrdreFabricationConverter {

    @Autowired
    private ModelMapper modelMapper;

    public OrdreFabricationDTO toDto(OrdreFabrication ordre) {
        OrdreFabricationDTO ordreDTO = modelMapper.map(ordre, OrdreFabricationDTO.class);
        
        // Mapping manuel pour les IDs (comme dans le cours)
        if (ordre.getProduit() != null) {
            ordreDTO.setProduitId(ordre.getProduit().getId());
        }
        
        if (ordre.getMachine() != null) {
            ordreDTO.setMachineId(ordre.getMachine().getId());
        }
        
        return ordreDTO;
    }

    public OrdreFabrication fromDto(OrdreFabricationDTO ordreDTO) {
        return modelMapper.map(ordreDTO, OrdreFabrication.class);
    }

    public List<OrdreFabricationDTO> toDtoList(List<OrdreFabrication> ordres) {
        return ordres.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<OrdreFabrication> fromDtoList(List<OrdreFabricationDTO> ordreDTOs) {
        return ordreDTOs.stream()
                .map(this::fromDto)
                .collect(Collectors.toList());
    }
}