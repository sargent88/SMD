select visit.visit_id, visit.date, visit.location, visit.reason, visit.prescription, visit.followup, visit.notes from visit
where visit.patient_id=$1