insert into visit
(patient_id, date, area_hurt, reason, prescription, followup, notes)
values($1, GETDATE(), '', '', '', false, '');