import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[schemas.CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("", response_model=schemas.CategoryOut)
def create_category(cat: schemas.CategoryBase, db: Session = Depends(get_db)):
    cat_id = "cat-" + os.urandom(4).hex()
    slug = cat.name.lower().replace(" ", "-")

    new_cat = models.Category(
        id=cat_id,
        name=cat.name,
        slug=slug,
        image=cat.image,
        count=0
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat
