---
title: "JAX-HDC: High-Performance Hyperdimensional Computing in JAX"
description: Open-source JAX library for hyperdimensional computing and vector symbolic architectures. Implements BSC, MAP, HRR, and FHRR with XLA acceleration, achieving 8-80x speedups across CPUs, GPUs, and TPUs. Published in JMLR, 2025.
tags: [JMLR 2025, hyperdimensional computing, JAX/XLA]
date: 2025-06-01
---

Open-source JAX library for hyperdimensional computing (HDC) and vector symbolic architectures (VSA). Published in the Journal of Machine Learning Research, 2025.

## Overview

JAX-HDC provides a unified functional API for four VSA models — Binary Spatter Codes (BSC), Multiply-Add-Permute (MAP), Holographic Reduced Representations (HRR), and Fourier HRR — fully compatible with JAX transforms (`jit`, `vmap`, `pmap`, `grad`).

## Key Results

- 8–10x CPU speedups over NumPy, 40–80x GPU speedups over PyTorch baselines
- XLA compilation enables kernel fusion and hardware acceleration across CPUs, GPUs, and TPUs
- Benchmarked on EU languages, EMG gestures, and VoiceHD classification tasks

## Features

- Random and feature encoders, centroid classifiers, gradient-based learning integration
- Designed for large-scale HDC research in ML, neuro-symbolic AI, and edge computing

[Read the paper](/papers/JAX-HDC_library_JLMR.pdf)
