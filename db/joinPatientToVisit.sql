select visit.date, visit.area_hurt, visit.reason, visit.prescription, visit.followup, visit.notes from visit
where visit.patient_id=$1