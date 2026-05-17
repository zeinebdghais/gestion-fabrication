package tn.itbs.fabrication.converters;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tn.itbs.fabrication.dto.EmployeDTO;
import tn.itbs.fabrication.entities.Employe;

@Component
public class EmployeConverter {

    @Autowired
    private ModelMapper modelMapper;

    public EmployeDTO toDto(Employe employe) {
        EmployeDTO employeDTO = modelMapper.map(employe, EmployeDTO.class);
        
        if (employe.getMachineAssignee() != null) {
            employeDTO.setMachineId(employe.getMachineAssignee().getId());
        }
        
        return employeDTO;
    }

    public Employe fromDto(EmployeDTO employeDTO) {
        return modelMapper.map(employeDTO, Employe.class);
    }

    public List<EmployeDTO> toDtoList(List<Employe> employes) {
        return employes.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<Employe> fromDtoList(List<EmployeDTO> employeDTOs) {
        return employeDTOs.stream()
                .map(this::fromDto)
                .collect(Collectors.toList());
    }
}