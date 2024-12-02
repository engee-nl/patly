#!/bin/bash
uvicorn app.main:app --host 0.0.0.0 --port 8200 --reload --timeout-keep-alive 180