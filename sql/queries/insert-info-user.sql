INSERT INTO public.infousers (
  slack_id, organization, "name",
  first_name, last_name, real_name, real_name_normalized,
  display_name, display_name_normalized,
  image, color)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
ON CONFLICT (slack_id) DO NOTHING;
