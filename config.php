<?php
class Config {
    const REGIONES = ['norte', 'sur', 'este'];
    
    public static function getRegionPorIP($ip) {
        // Lógica simple para determinar región por IP
        $ip_prefix = substr($ip, 0, 3);
        $regiones_ip = [
            '192' => 'norte',
            '193' => 'sur', 
            '194' => 'este'
        ];
        
        return $regiones_ip[$ip_prefix] ?? 'norte';
    }
    
    public static function getRegionPorCodigoPostal($cp) {
        $regiones_cp = [
            '01000' => 'norte',
            '02000' => 'sur',
            '03000' => 'este'
        ];
        
        return $regiones_cp[$cp] ?? 'norte';
    }
}
?>