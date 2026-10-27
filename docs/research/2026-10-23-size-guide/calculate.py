"""Reproduce descriptive research summaries. This is not a sizing engine."""
import json
from collections import defaultdict
from pathlib import Path
from statistics import mean, median

HERE = Path(__file__).resolve().parent
data = json.loads((HERE / "observations.json").read_text(encoding="utf-8"))
sources = json.loads((HERE / "sources.json").read_text(encoding="utf-8"))["sources"]
source_brand = {s["id"]: s["brand"] for s in sources}
anchors = defaultdict(list)
for group in data["body"]:
    if group["source"] not in {"hm-id", "adidas-body-ae", "mothercare-sg"}:
        continue
    for height, low, high, cmin, cmax, wmin, wmax in group["rows"]:
        anchors[height].append({"source": group["source"], "chest": (cmin+cmax)/2,
                                "waist": None if wmin is None else (wmin+wmax)/2,
                                "chest_range": [cmin, cmax]})

body_summary = []
for height, rows in sorted(anchors.items()):
    assert len({r["source"] for r in rows}) == len(rows), "One vote per brand per anchor"
    def stats(metric):
        values = [r[metric] for r in rows if r[metric] is not None]
        return None if not values else {"mean_cm": round(mean(values), 2),
                "median_cm": round(median(values), 2), "min_cm": min(values),
                "max_cm": max(values), "n": len(values)}
    body_summary.append({"nominal_height_anchor_cm": height, "brand_count": len(rows),
                         "chest": stats("chest"), "waist": stats("waist"),
                         "source_ids": [r["source"] for r in rows],
                         "public_recommendation_eligible": False})

garment_summary = []
for group in data["garment"]:
    for label, chest, length in group["rows"]:
        garment_summary.append({"category": group["category"], "cut": group["cut"],
            "size_label": label, "source_ids": [group["source"]], "brand_count": 1,
            "product_count": 1, "garment_chest_circumference_cm": chest,
            "derived_half_chest_cm": chest/2, "front_length_cm": length,
            "cross_brand_mean_cm": None, "status": group["aggregation_status"],
            "public_recommendation_eligible": False})

shoe_sources = {g["source"]: dict(g["rows"]) for g in data["footwear"]}
shoe_audit = [{"EU_label": label, "adidas_heel_to_toe_cm": foot,
    "bata_observed_foot_length_cm": shoe_sources["bata-id"][label],
    "observed_difference_cm": round(abs(shoe_sources["bata-id"][label]-foot),2),
    "cross_brand_mean_cm": None, "status": "not_pooled_conflicting_bata_source"}
    for label, foot in shoe_sources["adidas-shoe-ae"].items()]

out = {"status": "research_only_not_calibrated", "checked_on": "2026-10-23",
    "method": "Equal brand weighting. Range midpoint is an explicit analytical assumption, not a measured population mean. Body anchors group nominal labels only; H&M gives a nominal height, others height bands. Regional references are not Indonesian SKU validation. No weight/height inference, garment ease, or shoe size recommendation is derived.",
    "observed_brand_count": len({source_brand[g["source"]] for g in data["body"]+data["garment"]+data["footwear"]} | {"Nike"}),
    "observation_count": sum(len(g["rows"]) for k in ("body", "garment", "footwear") for g in data[k]) + len(data["nike_body_inch"]),
    "body_nominal_anchor_sample": body_summary,
    "garment_cut_coverage": garment_summary, "footwear_source_audit": shoe_audit,
    "nike_cm": [[row[0]] + [round(x*2.54, 3) for x in row[1:]] for row in data["nike_body_inch"]]}
(HERE / "summary.json").write_text(json.dumps(out, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
print(json.dumps({"brands":out["observed_brand_count"],"observations":out["observation_count"],
    "body_anchor_sample":body_summary,"garment_cross_brand_benchmarks":0,
    "production_recommendation_eligible":False}, ensure_ascii=False, indent=2))
