def calculate_dwpi(
    groundwater_depth: float,
    groundwater_baseline: float,
    pending_bookings: int,
    assigned_tanker_count: int,
    emergency_mode: bool,
    critical_infra_flag: bool,
) -> float:
    """
    Calculate the Dynamic Water Priority Index (DWPI) for a ward.

    Factors and weights:
      - Groundwater stress (depth vs baseline): 30%
      - Pending demand (bookings vs tankers):   30%
      - Emergency mode override:                20%
      - Critical infrastructure flag:           20%

    Returns a float between 0.0 and 1.0.

    Classification:
      RED    >= 0.80
      YELLOW >= 0.50
      GREEN  <  0.50
    """

    # 1. Groundwater stress — how far depth exceeds baseline (capped at 1.0)
    if groundwater_baseline > 0:
        gw_ratio = groundwater_depth / groundwater_baseline
        gw_stress = min((gw_ratio - 1.0) / 1.0, 1.0) if gw_ratio > 1.0 else 0.0
    else:
        gw_stress = 0.5

    # 2. Demand pressure — pending bookings relative to tanker capacity
    if assigned_tanker_count > 0:
        demand_ratio = pending_bookings / (assigned_tanker_count * 5)
        demand_pressure = min(demand_ratio, 1.0)
    else:
        demand_pressure = 1.0 if pending_bookings > 0 else 0.0

    # 3. Emergency mode — binary flag
    emergency_score = 1.0 if emergency_mode else 0.0

    # 4. Critical infrastructure — binary flag
    critical_score = 1.0 if critical_infra_flag else 0.0

    # Weighted combination
    dwpi = (
        0.30 * gw_stress
        + 0.30 * demand_pressure
        + 0.20 * emergency_score
        + 0.20 * critical_score
    )

    return round(min(max(dwpi, 0.0), 1.0), 2)


def classify_dwpi(score: float) -> str:
    """Classify a DWPI score into RED, YELLOW, or GREEN."""
    if score >= 0.80:
        return "RED"
    elif score >= 0.50:
        return "YELLOW"
    else:
        return "GREEN"
